"use client";
import MyPageProfile from "./_components/MyPageProfile";
import ChangeProfileModalButton from "./_components/ChangeProfileModalButton";
import { useAuthStore } from "@/zustand/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function MyPage() {
  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    console.log(user);
  }, [user]);

  const router = useRouter();
  if (user === null) {
    return;
  }
  //if (user === null) {
  // alert("로그인되어야 마이페이지를 확인 할 수 있습니다.");
  // router.push("/signin");
  // } else {
  return (
    <div className="pb-[200px] pt-[70px]">
      {/* <MyPageProfile />
      <ChangeProfileModalButton /> */}
    </div>
  );
  // }
}

export default MyPage;
