import { response } from "express";
import { NextRequest, NextResponse } from "next/server";

const serviceKey = process.env.PET_WITH_PLACE_API_KEY;

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const response = await fetch(
      `https://api.odcloud.kr/api/15111389/v1/${process.env.PET_WITH_PLACE_CALL_URL}?page=1&perPage=20&serviceKey=${process.env.PET_WITH_PLACE_API_KEY}`,
      // {
      //   headers: {
      //     accept: "*/*",
      //     Authorization: serviceKey
      //   }
      // }
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching artist data:", error);
    return NextResponse.json({ error: "Failed to fetch artist data" }, { status: 500 });
  }
};
