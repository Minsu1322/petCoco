import { Suspense } from "react";
import dynamic from "next/dynamic";

const ClientMessageComponent = dynamic(() => import("@/components/message/ClientMessageComponent"), {
  ssr: false
});

export default function MessagePage() {
  return (
    <div className="container mx-auto w-full">
      <Suspense fallback={<div className="text-center">로딩 중...</div>}>
        <ClientMessageComponent />
      </Suspense>
    </div>
  );
}
