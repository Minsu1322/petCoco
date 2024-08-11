"use client";
import AnimalCarousel from "@/components/animalCarousel/AnimalCarousel";
import { EmblaOptionsType } from "embla-carousel";
import Image from "next/image";
import MateCarousel from "@/components/mateCarousel/MateCarousel";
import RecentPosts from "@/components/community/CommunityMain";
import Link from "next/link";

export default function Home() {
  const AnimalOPTIONS: EmblaOptionsType = { align: "center", dragFree: true, loop: true, startIndex: 2 };
  const AnimalSLIDE_COUNT = 7;
  const AnimalSLIDES = Array.from(Array(AnimalSLIDE_COUNT).keys());

  const MateOPTIONS: EmblaOptionsType = { align: "center", dragFree: true, loop: true, startIndex: 2 };
  const MateSLIDE_COUNT = 5;
  const MateSLIDES = Array.from(Array(MateSLIDE_COUNT).keys());

  return (
    <div className="flex min-h-screen flex-col items-center gap-8">
      <div className="flex w-full flex-col items-center justify-center">
        {/* 배너 이미지 */}
        <Image
          src="https://eoxrihspempkfnxziwzd.supabase.co/storage/v1/object/public/banner_img/banner004.png"
          alt="banner images"
          width={500}
          height={150}
          layout="responsive"
          className="rounded-lg"
        />
      </div>

      {/* 게시글 영역 */}
      <div className="flex w-full flex-col px-4">
        {/* 자유게시판 */}
        <div className="mt-6 w-full rounded-lg bg-white p-4">
          <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/community`}>
            <h2 className="text-xl font-bold text-[#7FA6EE] hover:underline">방금 올라온 반려이야기😀</h2>
          </Link>

          <RecentPosts postCount={5} />
        </div>

        {/* 산책메이트 */}
        <div className="mt-6 w-full rounded-lg bg-white p-4">
          <h2 className="border-b pb-2 text-xl font-bold text-[#11BBB0] hover:underline">산책메이트를 찾아요!</h2>
          <MateCarousel slides={MateSLIDES} options={MateOPTIONS} />
        </div>

        {/* 유기견 배너+캐러셀*/}
        <div className="mt-6 flex w-auto flex-col items-center justify-center">
          <Image
            src="https://eoxrihspempkfnxziwzd.supabase.co/storage/v1/object/public/banner_img/banner003.png"
            alt="banner images"
            width={600}
            height={150}
            layout="responsive"
            className="rounded-lg"
          />

          <div className="mt-1 w-full rounded-lg bg-white p-4">
            <AnimalCarousel slides={AnimalSLIDES} options={AnimalOPTIONS} />
          </div>
        </div>
      </div>
    </div>
  );
}
