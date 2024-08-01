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
  const userLat = parseFloat(searchParams.get("userLat") || "0");
  const userLng = parseFloat(searchParams.get("userLng") || "0");

  try {
    let query = supabase
      .from("matePosts")
      .select(`
      *,
      users(*),
      matePostPets(*)
      `, { count: "exact" });

    if (search) {
      query = query.ilike("content", `%${search}%`);
    }

    if (isCurrentPosts === "true") {
      query = query.eq("recruiting", true);
    }

    // 정렬 조건 적용
    if (filter.sort === "distance" && userLat !== 0 && userLng !== 0) {
      query = query.order('distance', { ascending: true });
    } else if (filter.sort === "recruitment_end") {
      query = query.gte("recruitment_end", new Date().toISOString()).order("recruitment_end", { ascending: true });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    // 기존 필터 적용
    if (filter.gender && filter.gender !== "전체") {
      query = query.eq("users.gender", filter.gender);
    }

    if (filter.age && filter.age !== "전체") {
      query = query.eq("users.age", filter.age);
    }

    if (filter.date_time) {
      query = query.ilike("date_time", `%${filter.date_time}%`);
    }

    if(filter.regions && filter.regions !== "전체") {
      const regionPrefix = filter.regions.slice(0, 2);
      query = query.ilike("address", `${regionPrefix}%`);
    }

    if (filter.weight) {
      const weightValue = parseFloat(filter.weight);
      query = query.gte("matePostPets.weight", weightValue);
    }

    if (filter.male_female && filter.male_female !== "전체") {
      query = query.eq("matePostPets.male_female", filter.male_female);
    }

    query = query.not("users", "is", null).not("matePostPets", "is", null);

    const { data, error, count } = await query.range((page - 1) * limit, page * limit - 1);

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

 // location 필드에 값 추출에서 추가, 따로 넣어줒 않아도
  const postDataWithLocation = {
    ...post_data,
    location: `POINT(${post_data.position.center.lng} ${post_data.position.center.lat})`
  };
//   const post_data_json = JSON.stringify(postDataWithLocation);
// const pets_data_json = JSON.stringify(pets_data);

  try {
    // RPC 함수 호출


   

    const { data, error } = await supabase.rpc("create_mate_post_with_pets", {
      post_data: postDataWithLocation,  // JSON 객체로 전달
      pets_data: pets_data  // JSON 객체로 전달
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
