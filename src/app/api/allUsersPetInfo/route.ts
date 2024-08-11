import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
    .from('usersPet')
    .select('*,users("*")')
    // .order('random')
    // TODO: rpc로 랜덤하게 가져오는 것 추가
    .limit(10);

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

