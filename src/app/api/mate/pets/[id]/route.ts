import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createClient();
  const { id } = params;

  try { 
    const { data, error } = await supabase
    .from("usersPet")
    .select("*")
    .eq("id", id); 

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "데이터를 가져오는 데 실패했습니다." }, { status: 500 });
  }

}