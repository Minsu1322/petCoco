// Header 임시 파일

import Link from "next/link";
import LogoutButton from "./auth/LogoutBtn";

const Header = () => {
  return (
    <header className="mb-6 w-full items-center bg-[#1FE476] px-10 py-6 text-white">
      <div className="flex justify-center gap-6">
        <Link href={"/"}>
          <p>홈(임시 헤더)</p>
        </Link>

        <Link href={"/community"}>
          <p>커뮤니티</p>
        </Link>

        <LogoutButton />
      </div>
    </header>
  );
};

export default Header;
