"use client";
import MyPageProfile from "./_components/MyPageProfile";
import ChangeProfileModalButton from "./_components/ChangeProfileModalButton";
import { useAuthStore } from "@/zustand/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

function MyPage() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    console.log(user);
  }, [user]);

  if (user === null) {
    alert("로그인되어야 마이페이지를 확인 할 수 있습니다.");
    //router.push("/signin");
  } else {
    return (
      <div className="pb-[200px] pt-[70px]">
        <div className="flex flex-col items-center justify-center">
          <div className="my-auto flex flex-col items-center justify-center px-[15px] text-[24px] sm:text-[48px] lg:px-0">
            <img className="h-[170px] w-[170px] rounded-full bg-lime-300 object-cover" src={user.profile_img} alt="" />
            <span className="text-[24px] font-bold text-[#24CAFF] sm:text-[48px]">{user.nickname}</span>님 반갑습니다.
            <Link
              className="rounded border border-[#C9C9C9] bg-[#D1D1D1] px-4 py-2 text-center font-bold text-white"
              href={`/mypage/${user.id}/myprofile`}
            >
              내 프로필
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default MyPage;
