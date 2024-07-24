import { createClient } from "@/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createClient();

  const { searchParams } = request.nextUrl;
  const query = searchParams.get("query");


  try {
    const { data, error } = await supabase
      .from("matePosts")
      .select()
      .like('content', `%${query}%`);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ err }, { status: 500 });
  }
};
