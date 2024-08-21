import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  // URL에서 쿼리 파라미터 추출
  const { searchParams } = request.nextUrl;
  const lng = searchParams.get("x");
  const lat = searchParams.get("y");

  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2address.json?input_coord=WGS84&x=${lng}&y=${lat}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_MAPS_CONVERT_API_KEY}`
        }
      }
    );

    //console.log(response);
    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.message }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
