import { error } from "console";
import { ChangeEvent, useState } from "react";
import MyPageProfile from "./components/MyPageProfile";
import ChangeProfileModalButton from "./components/ChangeProfileModalButton";

function MyPage() {
  //const user = useAuthStore((state) => state.user);
  //const router = useRouter();
  // if (!user) {
  //  alert("로그인되어야 마이페이지를 확인 할 수 있습니다.");
  //   router.push("/login");
  // } else {
  return (
    <div className="pt-[70px] pb-[200px]">
      <MyPageProfile />
      <ChangeProfileModalButton />
      {/* <MyPageList /> */}
    </div>
  );
  // }
}

export default MyPage;
