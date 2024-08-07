import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

const API_BASE_URL = "https://apis.data.go.kr/1543061/abandonmentPublicSrvc/abandonmentPublic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const animalType = searchParams.get("type") || "dog";

  const today = new Date();
  const MonthsAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

  const endde = formatDate(today);
  const bgnde = formatDate(MonthsAgo);

  const upkind = animalType === "cat" ? "422400" : "417000";

  const apiUrl = `${API_BASE_URL}?serviceKey=${process.env.SERVICE_KEY}&bgnde=${bgnde}&endde=${endde}&upkind=${upkind}&pageNo=1&numOfRows=100`;

  try {
    const response = await fetch(apiUrl);
    const xmlData = await response.text();
    const parser = new XMLParser();
    const jsonData = parser.parse(xmlData);
    return NextResponse.json(jsonData);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}
