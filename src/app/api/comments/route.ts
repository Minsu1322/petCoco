import { NextResponse } from "next/server";
import { createClient } from "@/supabase/client";

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
      nickname
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
