import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const supabase = createClient();
  const url = new URL(request.url);
  const ids = url.searchParams.get('ids')?.split(',') || [];

  if (ids.length === 0) {
    return NextResponse.json({ error: "ids are required" }, { status: 400 });
  }

  try { 
    const { data, error } = await supabase
      .from("usersPet")
      .select("*")
      .in("id", ids);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "데이터를 가져오는 데 실패했습니다." }, { status: 500 });
  }
}