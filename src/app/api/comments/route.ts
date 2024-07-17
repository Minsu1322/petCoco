import { NextResponse } from "next/server";
import { createClient } from "@/supabase/client"; // 클라이언트 파일 경로

export async function GET() {
  const supabase = createClient(); // 클라이언트 생성

  const { data, error } = await supabase.from("comments").select(`
      id,
      content,
      created_at,
      user: users (
        nickname,
        profileImageUrl
      )
    `);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
