"use client";
import MyPageProfile from "./_components/MyPageProfile";
import ChangeProfileModalButton from "./_components/ChangeProfileModalButton";
import { useAuthStore } from "@/zustand/useAuth";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

function MyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    console.log(user);
  }, [user]);

  const getProfileData = async () => {
    const response = await fetch(`/api/mypage/${id}/myprofile`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    const data = response.json();

    return data;
  };

  const {
    data: userProfile,
    isPending,
    isError
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getProfileData
  });
  if (isPending) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (isError) {
    alert("데이터 로딩 실패");
    return null;
  }

  if (user === null) {
    alert("로그인되어야 마이페이지를 확인 할 수 있습니다.");
    //   router.push("/signin");
  } else {
    return (
      <div className="pb-[200px] pt-[70px]">
        <div className="flex flex-col items-center justify-center">
          <div className="my-auto flex flex-col items-center justify-center px-[15px] text-[24px] sm:text-[48px] lg:px-0">
            <img
              className="h-[170px] w-[170px] rounded-full bg-lime-300 object-cover"
              src={userProfile.profile_img}
              alt=""
            />
            <span className="font-bold text-[#42E68A] sm:text-[48px]">
              {userProfile.nickname}
              <div className="text-[36px] text-black">님 반갑습니다.</div>
            </span>

            <Link
              className="rounded border bg-[#42E68A] px-4 py-2 text-center text-[16px] font-semibold text-black"
              href={`/mypage/${userProfile.id}/myprofile`}
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
