import { NextResponse } from "next/server";
import { createClient } from "@/supabase/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "18"); // 3열 5줄 = 15개
  const category = searchParams.get("category") || "전체";

  const supabase = createClient();

  try {
    let query = supabase
      .from("posts")
      .select(
        `
        *,
        users (
          id,
          nickname
        )
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false });

    if (category !== "전체" && category !== "인기글") {
      query = query.eq("category", category);
    }

    const { data, error, count } = await query.range((page - 1) * limit, page * limit - 1);

    console.log(data);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      data,
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count! / limit)
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "An unexpected error occurred" }, { status: 500 });
  }
}
