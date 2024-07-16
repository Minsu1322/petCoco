// Header 임시 파일

import Link from "next/link";

const Header = () => {
  return (
    <header className="grid grid-cols-main-layout w-full gap-2.5 justify-between py-4 px-10 items-center">
      <Link href={"/"}>
        <p>링크</p>
      </Link>
      <div className="flex flex-1 items-center justify-between">
        <div className="flex flex-grow max-w-[400px]">
        </div>
        <div className="flex items-center">
          <div className="mr-0.5">
            <div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
