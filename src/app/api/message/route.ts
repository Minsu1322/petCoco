export const runtime = "edge";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is missing" }, { status: 400 });
  }

  let query = supabase.from("messages").select("*");

  if (type === "received") {
    query = query.eq("receiver_id", userId);
  } else if (type === "sent") {
    query = query.eq("sender_id", userId);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Database error:", error); // 데이터베이스 에러 로깅
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, data });
}
