// Header 임시 파일

import Link from "next/link";

const Header = () => {
  return (
    <header className="grid-cols-main-layout grid w-full items-center justify-between gap-2.5 px-10 py-4">
      <Link href={"/"}>
        <p>링크</p>
      </Link>
      <div className="flex flex-1 items-center justify-between">
        <div className="flex max-w-[400px] flex-grow"></div>
        <div className="flex items-center">
          <div className="mr-0.5">
            <div></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
