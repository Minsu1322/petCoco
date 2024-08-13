"use client";
import { useAuthStore } from "@/zustand/useAuth";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TabBar = () => {
  const { user } = useAuthStore((state) => ({
    user: state.user
  }));
  const pathname = usePathname();

  return pathname === "/message" ? (
    <></>
  ) : (
    <div className="fixed bottom-0 w-full border border-bgGray500 bg-white pb-[0.7rem] pt-[0.3rem] z-50">
      <div className="flex justify-between gap-x-[1.2rem] px-[0.8rem] py-[0.2rem]">
        <Link href="/" passHref>
          <div className="flex flex-col items-center justify-center gap-y-[0.2rem]">
            <Image src="/assets/svg/Kenner.svg" alt="홈" width={24} height={24} />
            <p className="text-center text-[0.61863rem] text-bgGray500">홈</p>
          </div>
        </Link>

        <Link href="/community2" passHref>
          <div className="flex flex-col items-center justify-center gap-y-[0.2rem]">
            <Image src="/assets/svg/dog.svg" alt="커뮤니티" width={24} height={24} />
            <p className="text-center text-[0.61863rem] text-bgGray500">커뮤니티</p>
          </div>
        </Link>

        <Link href="/mate" passHref>
          <div className="flex flex-col items-center justify-center gap-y-[0.2rem]">
            <Image src="/assets/svg/paw.svg" alt="산책 메이트" width={24} height={24} />
            <p className="text-center text-[0.61863rem] text-bgGray500">산책 메이트</p>
          </div>
        </Link>

        <Link href="/message" passHref>
          <div className="flex flex-col items-center justify-center gap-y-[0.2rem]">
            <Image src="/assets/svg/chat(message).svg" alt="채팅" width={24} height={24} />
            <p className="text-center text-[0.61863rem] text-bgGray500">채팅</p>
          </div>
        </Link>

        <Link href={`/mypage2/${user?.id}`} passHref>
          <div className="flex flex-col items-center justify-center gap-y-[0.2rem]">
            <Image src="/assets/svg/my.svg" alt="마이페이지" width={24} height={24} />
            <p className="text-center text-[0.61863rem] text-bgGray500">마이페이지</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TabBar;
