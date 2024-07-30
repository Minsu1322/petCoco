import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const supabase = createClient();
    const { data, error } = await supabase.from("usersPet").select("*").eq("users_id", id);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "데이터를 가져오는 데 실패했습니다." }, { status: 500 });
  }
}
export const POST = async (request: NextRequest) => {
  const supabase = createClient();
  const newPet = await request.json();

  try {
    const { data, error } = await supabase.from("usersPet").insert(newPet);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ err }, { status: 500 });
  }
};

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
    const newData = await request.json();

    const supabase = createClient();
    const { data, error } = await supabase.from("usersPet").update(newData).eq("id", id);
    if (error) {
      return NextResponse.json(error);
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "프로필 업데이트가 실패했습니다." });
  }
}
