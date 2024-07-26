import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { MateNextPostType, Pets } from "@/types/mate.type";

interface CreateMatePostWithPetsData {
  post_data: MateNextPostType;
  pets_data: Pets[];
}

export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("matePosts")
      .select("*,users(nickname),matePostPets(*)")
      .order("created_at", { ascending: false });
    // .limit(10);
    // console.log(data)
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

export const POST = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createClient();
  const { post_data, pets_data }: CreateMatePostWithPetsData = await request.json();

  console.log("Received Data:", post_data, pets_data);

  try {
    // RPC 함수 호출
    const { data, error } = await supabase.rpc("create_mate_post_with_pets", {
      post_data,
      pets_data
    });

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
