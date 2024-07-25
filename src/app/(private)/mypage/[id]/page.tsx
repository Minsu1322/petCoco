import MyPageProfile from "./_components/MyPageProfile";
import ChangeProfileModalButton from "./_components/ChangeProfileModalButton";

function MyPage() {
  //const user = useAuthStore((state) => state.user);
  //const router = useRouter();
  // if (!user) {
  //  alert("로그인되어야 마이페이지를 확인 할 수 있습니다.");
  //   router.push("/login");
  // } else {
  return (
    <div className="pb-[200px] pt-[70px]">
      <MyPageProfile />
      <ChangeProfileModalButton />

      {/* <MyPageList /> */}
    </div>
  );
  // }
}

export default MyPage;
