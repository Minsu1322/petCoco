"use client";
import React from "react";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  return pathname === "/message" ? <></> : <footer className="min-h-12 w-full bg-mainColor text-black"></footer>;
};

export default Footer;
