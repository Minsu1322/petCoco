import { createClient } from "@/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const supabase = createClient();
    const { data, error } = await supabase.from("users").select("*").eq("id", id).maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "데이터를 가져오는 데 실패했습니다." }, { status: 500 });
  }
  // const updateProfileWithSupabase = async (profileData: any, id: string) => {
  //   const { data: result } = await supabase.from("users").update(profileData).eq("id", id);
  //   return result;
  // };
}
