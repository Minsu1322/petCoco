"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

interface NavLinkProps extends PropsWithChildren {
  href: string;
}
const NavLink = ({ children, href }: NavLinkProps) => {
  const pathname = usePathname();
  const fixedPathName = "/" + pathname.split("/")[1];
  let isPath = "";
  if (pathname === href) {
    isPath = href;
  }
  if (fixedPathName === href) {
    isPath = "/" + pathname.split("/")[1];
  }

  return (
    <Link
    href={href}
    className={`flex h-[50px] w-[90%] items-center rounded-md px-6 ${isPath ? "bg-mainHoverLightColor" : "bg-white"} hover:bg-mainColor`}
    >
      {children}
  </Link>
  );
};

export default NavLink;
