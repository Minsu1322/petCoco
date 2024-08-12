import { Suspense } from "react";
import dynamic from "next/dynamic";
import RootLayout from "@/app/layout";

const ClientMessageComponent = dynamic(() => import("@/components/message/ClientMessageComponent"), {
  ssr: false
});

export default function MessagePage() {
  return (
    <RootLayout hideHeaderFooter>
      <div className="container mx-auto w-full">
        <Suspense fallback={<div className="text-center">로딩 중...</div>}>
          <ClientMessageComponent />
        </Suspense>
      </div>
    </RootLayout>
  );
}
