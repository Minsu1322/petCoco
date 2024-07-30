import { NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

export async function POST(request: Request) {
  const supabase = createClient();
  try {
    const { title, content, category, userId, createdAt } = await request.json();

    // 입력 검증
    if (!title || !content || !category || !userId || !createdAt) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // 데이터베이스 삽입
    const { data, error } = await supabase
      .from("posts")
      .insert([{ title, content, category, user_id: userId, created_at: createdAt }])
      .single();

    // 에러 처리
    if (error) {
      throw error;
    }

    // 성공 응답
    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    // 일반 에러 처리
    return NextResponse.json({ error: error.message || "An unexpected error occurred" }, { status: 500 });
  }
}

export function OPTIONS() {
  const headers = {
    Allow: "POST, OPTIONS"
  };
  return NextResponse.json(null, { headers });
}
