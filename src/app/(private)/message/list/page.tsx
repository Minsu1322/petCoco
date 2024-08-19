import { Suspense } from "react";
import dynamic from "next/dynamic";

const ClientMessageListComponent = dynamic(() => import("@/components/message/ClientMessageListComponent"), {
  ssr: false
});

export default function MessageListPage() {
  return (
    <div className="container mx-auto w-full">
      <Suspense fallback={<div className="text-center">로딩 중...</div>}>
        <ClientMessageListComponent />
      </Suspense>
    </div>
  );
}
