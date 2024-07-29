import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { MateNextPostType, Pets } from "@/types/mate.type";

interface CreateMatePostWithPetsData {
  post_data: MateNextPostType;
  pets_data: Pets[];
}

export const GET = async (request: NextRequest) => {
  const supabase = createClient();

  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "8");
  const isCurrentPosts = searchParams.get("current");
  const filter = Object.fromEntries(searchParams.entries());
  //console.log(filter);

  try {
    let query = supabase
      .from("matePosts")
      .select(`*,users("*"),matePostPets("*")`, { count: "exact" })
      .order("created_at", { ascending: false });

    if (search) {
      query = query.ilike("content", `%${search}%`);
    }

    if (isCurrentPosts === "true") {
      query = query.eq("recruiting", true);
    }

    if (filter.gender) {
      query.eq("users.gender", filter.gender);
    }

    if (filter.age) {
      query.eq("users.age", filter.age);
    }

    if (filter.male_female) {
      query.eq("matePostPets.male_female", filter.male_female);
    }

    query.not("users", "is", null);
    query.not("matePostPets", "is", null);

    const { data, error, count } = await query.range((page - 1) * limit, page * limit - 1);
    console.log(data);
    // .limit(10);
    // console.log(data)
    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data,
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count! / limit)
    });
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
