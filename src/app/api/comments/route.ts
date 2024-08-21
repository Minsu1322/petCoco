import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("id");

  if (!postId) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from("comments")
    .select(
      `
    *,
    users (
      id,
      nickname,
      profile_img
    )
  `
    )
    .eq("post_id", postId);
  console.log(data);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const commentId = searchParams.get("id");
  const supabase = createClient();

  if (!commentId) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase.from("comments").delete().eq("id", commentId);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ err }, { status: 500 });
  }
}
