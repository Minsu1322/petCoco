import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

export async function POST(request: Request) {
  const supabase = createClient();

  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const userId = formData.get("userId") as string;
    const createdAt = formData.get("createdAt") as string;
    const images = formData.getAll("images") as File[];

    // 입력 검증
    if (!title || !content || !category || !userId || !createdAt) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // 데이터베이스 삽입
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .insert([{ title, content, category, user_id: userId, created_at: createdAt }])
      .select()
      .single();

    // 에러 처리
    if (postError) {
      throw postError;
    }

    // // 이미지 업로드 및 URL 저장
    // if (postData && images.length > 0) {
    //   const postId = postData.id;
    //   for (const image of images) {
    //     const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    //     const { error: uploadError } = await supabase.storage.from("post_imageURL").upload(fileName, image);

    //     if (uploadError) throw uploadError;

    //     const { data: urlData } = supabase.storage.from("post_imageURL").getPublicUrl(fileName);

    //     if (urlData) {
    //       // await supabase.from("posts").insert({
    //         // post_id: postId,
    //         // image_url: urlData.publicUrl
    //       });
    //     }
    //   }
    // }

    // 성공 응답
    return NextResponse.json({ data: postData }, { status: 201 });
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
