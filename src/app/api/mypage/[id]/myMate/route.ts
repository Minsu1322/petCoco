import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createClient();
  const { id } = params;

  try {
    const { data, error } = await supabase.from("matePosts").select("*,users(*)").eq("user_id", id);

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
