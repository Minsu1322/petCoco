import { createClient } from "@/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
    const newData = await request.json();

    const supabase = createClient();
    const { data, error } = await supabase.from("users").update(newData).eq("id", id);
    if (error) {
      return NextResponse.json(error);
    }
    console.log(id);
    console.log(data);
    console.log(error);
    console.log(newData);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "프로필 업데이트가 실패했습니다." });
  }
}
