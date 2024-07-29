import { NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("id");
  console.log(postId);
  if (!postId) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const supabase = createClient();

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
    .eq("id", postId);
  console.log(data);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
