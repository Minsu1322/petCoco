import { NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "3");
  const category = searchParams.get("category") || "전체";
  const searchTerm = searchParams.get("search") || "";

  const supabase = createClient();

  try {
    let query = supabase.from("posts").select(
      `
        *,
        users (
          id,
          nickname
        ),
        comments (
          id
        ),
        likes( id
        )
      `,
      { count: "exact" }
    );

    if (category !== "전체" && category !== "인기글") {
      query = query.eq("category", category);
    }

    if (searchTerm) {
      query = query.ilike("title", `%${searchTerm}%`);
    }

    const { data: postsWithComments, error: countError, count } = await query;

    if (countError) {
      throw countError;
    }

    // 좋아요 수에 따라 정렬
    const sortedLikes = postsWithComments?.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));

    // 페이지네이션 적용
    const paginatedPosts = sortedLikes?.slice((page - 1) * limit, page * limit);

    // post_imageURL 처리
    paginatedPosts?.forEach((post: any) => {
      post.post_imageURL = post.post_imageURL?.split(",") || [];
    });

    return NextResponse.json({
      data: paginatedPosts,
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count! / limit)
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "An unexpected error occurred" }, { status: 500 });
  }
}
