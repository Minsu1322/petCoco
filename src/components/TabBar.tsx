"use client";
import { useAuthStore } from "@/zustand/useAuth";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TabBar: React.FC = () => {
  const { user } = useAuthStore((state) => ({
    user: state.user
  }));
  const pathname = usePathname();

  const getImageSrc = (path: string, defaultSrc: string, activeSrc: string): string => {
    return pathname === path ? activeSrc : defaultSrc;
  };

  const getTextColor = (path: string): string => {
    return pathname === path ? "#8E6EE8" : "#292826";
  };

  return pathname === "/message" || "/message/list" ? (
    <></>
  ) : (
    <div className="fixed bottom-0 z-50 w-full max-w-[420px] border border-t-bgGray500 bg-white bg-opacity-80 px-2 pb-[0.7rem] pt-[0.3rem]">
      <div className="flex justify-between gap-x-[1.2rem] px-[0.8rem] py-[0.2rem]">
        <Link href="/" passHref>
          <div className="flex flex-col items-center justify-center gap-y-[0.2rem]">
            <Image
              src={getImageSrc("/", "/assets/svg/Kenner.svg", "/assets/svg/ActiveKenner.svg")}
              alt="홈"
              width={24}
              height={24}
              priority
            />
            <p className="text-center text-[0.61863rem]" style={{ color: getTextColor("/") }}>
              홈
            </p>
          </div>
        </Link>

        <Link href="/community2" passHref>
          <div className="flex flex-col items-center justify-center gap-y-[0.2rem]">
            <Image
              src={getImageSrc("/community2", "/assets/svg/dog.svg", "/assets/svg/Activedog.svg")}
              alt="커뮤니티"
              width={24}
              height={24}
              priority
            />
            <p className="text-center text-[0.61863rem]" style={{ color: getTextColor("/community2") }}>
              커뮤니티
            </p>
          </div>
        </Link>

        <Link href="/mate" passHref>
          <div className="flex flex-col items-center justify-center gap-y-[0.2rem]">
            <Image
              src={getImageSrc("/mate", "/assets/svg/paw.svg", "/assets/svg/Activepaw.svg")}
              alt="산책 메이트"
              width={24}
              height={24}
              priority
            />
            <p className="text-center text-[0.61863rem]" style={{ color: getTextColor("/mate") }}>
              산책 메이트
            </p>
          </div>
        </Link>

        <Link href="/message/list" passHref>
          <div className="flex flex-col items-center justify-center gap-y-[0.2rem]">
            <Image
              src={getImageSrc("/message", "/assets/svg/chat(message).svg", "/assets/svg/Activechat(message).svg")}
              alt="채팅"
              width={24}
              height={24}
              priority
            />
            <p className="text-center text-[0.61863rem]" style={{ color: getTextColor("/message") }}>
              채팅
            </p>
          </div>
        </Link>

        <Link href={`/mypage2/${user?.id}`} passHref>
          <div className="flex flex-col items-center justify-center gap-y-[0.2rem]">
            <Image
              src={getImageSrc(`/mypage2/${user?.id}`, "/assets/svg/my.svg", "/assets/svg/Activemy.svg")}
              alt="마이페이지"
              width={24}
              height={24}
              priority
            />
            <p className="text-center text-[0.61863rem]" style={{ color: getTextColor(`/mypage2/${user?.id}`) }}>
              마이페이지
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TabBar;
