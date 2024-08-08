import { Suspense } from "react";
import dynamic from "next/dynamic";

const ClientMessageComponent = dynamic(() => import("@/components/message/ClientMessageComponent"), {
  ssr: false
});

export default function MessagePage() {
  return (
    <div className="container mx-auto max-w-4xl p-4">
      <Suspense fallback={<div className="p-4 text-center">로딩 중...</div>}>
        <ClientMessageComponent />
      </Suspense>
    </div>
  );
}
