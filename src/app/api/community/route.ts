import { NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "18");
  const category = searchParams.get("category") || "전체";
  const searchTerm = searchParams.get("search") || "";

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
        ),
        comments (
        id
        ).eq("post_id", postId)
        
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false });

    if (category !== "전체" && category !== "인기글") {
      query = query.eq("category", category);
    }

    if (searchTerm) {
      query = query.ilike("title", `%${searchTerm}%`);
    }

    const { data, error, count } = await query.range((page - 1) * limit, page * limit - 1);

    // console.log("before : ", data);
    data?.map((post: any) => {
      post.post_imageURL = post.post_imageURL?.split(",") || [];
    });
    // console.log("after : ", data);

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
