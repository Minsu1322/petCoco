import { createClient } from "@/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { MateNextPostType, Pets } from "@/types/mate.type";
import { UserType } from "@/types/auth.type";

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

  // 모집 마감 순 정렬
  const date = new Date();
  const currentTime = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const formattedDate = currentTime.toISOString();

try {
  // RPC 호출
  let { data: posts = [], error } = await supabase.rpc("get_mate_posts_with_distance", {
    lat: userLat,
    lng: userLng
  });

  if (error) {
    console.error('RPC Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // posts가 null일 경우 빈 배열로 초기화
  let validPosts = posts || [];

  // 필터링
  if (search) {
    validPosts = validPosts.filter(post => 
      post.content.toLowerCase().includes(search.toLowerCase()) ||
      post.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (isCurrentPosts === "true") {
    validPosts = validPosts.filter(post => post.recruiting);
  }

  // 정렬 조건 적용
  if (filter.sort === "distance" && userLat !== 0 && userLng !== 0) {
    validPosts = validPosts.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  } else if (filter.sort === "recruitment_end") {
    validPosts = validPosts.filter(post => new Date(post.recruitment_end) >= new Date(formattedDate));
    validPosts = validPosts.sort((a, b) => new Date(a.recruitment_end).getTime() - new Date(b.recruitment_end).getTime());
  } else {
    validPosts = validPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  if (filter.date_time) {
    validPosts = validPosts.filter(post => post.date_time.includes(filter.date_time));
  }

  if (filter.regions && filter.regions !== "전체") {
    const regionPrefix = filter.regions.slice(0, 2);
    validPosts = validPosts.filter(post => post.address.startsWith(regionPrefix));
  }

  if(filter.gender && filter.gender !== "전체") {
    validPosts = validPosts.filter(post => {
      if (Array.isArray(post.users)) {
        return (post.users as UserType[]).some(pet => 
          pet.gender === filter.gender
        );
      }
      return false;
    });
  }

  if(filter.age && filter.age !== "전체") {
    validPosts = validPosts.filter(post => {
      if (Array.isArray(post.users)) {
        return (post.users as UserType[]).some(pet => 
          pet.age === filter.age
        );
      }
      return false;
    });
  }

  if (filter.weight) {
    const weightValue = parseFloat(filter.weight);
    validPosts = validPosts.filter(post => {
      if (Array.isArray(post.matepostpets)) {
        return (post.matepostpets as Pets[]).some(pet => 
          pet.weight !== null && pet.weight >= weightValue
        );
      }
      return false;
    });
  }
  
  if (filter.male_female && filter.male_female !== "전체") {
    validPosts = validPosts.filter(post => {
      if (Array.isArray(post.matepostpets)) {
        return (post.matepostpets as Pets[]).some(pet => 
          pet.male_female === filter.male_female
        );
      }
      return false;
    });
  }

  // 페이지네이션 처리
  const total = validPosts.length;
  const paginatedPosts = validPosts.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    data: paginatedPosts,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  });
} catch (error) {
  console.error('Error:', error);
  return NextResponse.json({ error: error }, { status: 500 });
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
  // const post_data_json = JSON.stringify(postDataWithLocation);
  // const pets_data_json = JSON.stringify(pets_data);

  try {
    // RPC 함수 호출
    const { data, error } = await supabase.rpc("create_mate_post_with_pets", {
      post_data: postDataWithLocation, // JSON 객체로 전달
      pets_data: pets_data // JSON 객체로 전달
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
