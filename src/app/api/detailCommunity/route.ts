import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const url = new URL(request.url);

  let postId = url.searchParams.get("id");

  // id를 찾지 못한 경우 URL 경로에서 직접 추출 시도
  if (!postId) {
    const pathSegments = url.pathname.split("/");
    postId = pathSegments[pathSegments.length - 1];
  }

  if (!postId) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        users (
          *
        )
      `
      )
      .eq("id", postId)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "An error occurred while fetching the post" }, { status: 500 });
  }
};
