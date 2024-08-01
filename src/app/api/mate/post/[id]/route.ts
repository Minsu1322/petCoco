import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createClient();
  const { id } = params;

  try {
    const { data, error } = await supabase
      .from("matePosts")
      .select("*,users(nickname),matepostpets(*)")
      .select("*,users(nickname),matepostpets(*)")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // PGRST116는 Supabase에서 결과가 없을 때 발생하는 에러 코드
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};


export const PUT = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createClient();
  const { id } = params;

  const updatePost = await request.json();

  try {
    const { data, error } = await supabase.from("matePosts").update(updatePost).eq("id", id);

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

export const DELETE = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createClient();
  const { id } = params;

  try {
    const { data, error } = await supabase.from("matePosts").delete().eq("id", id);

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
