// src/app/api/chat/route.ts

import { NextResponse } from "next/server";
import { IMessage } from "@/types/chat";

export async function POST(request: Request) {
  try {
    const { nickname, userId, content }: IMessage = await request.json();

    // 로그를 추가하여 데이터가 올바르게 전달되는지 확인합니다.
    console.log("Received data:", { nickname, userId, content });

    // 데이터 처리 또는 저장 로직을 여기에 추가합니다.
    // 예: 데이터베이스에 저장하거나 다른 작업을 수행합니다.

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Error processing message:", error);
    return NextResponse.json({ status: "error", details: error }, { status: 500 });
  }
}
