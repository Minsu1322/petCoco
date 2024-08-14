import React, { ReactNode, Suspense } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
};

export default Layout;
