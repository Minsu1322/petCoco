import { Suspense } from "react";
import dynamic from "next/dynamic";

// ClientMessageComponent를 동적으로 import합니다.
const ClientMessageComponent = dynamic(() => import("@/components/message/ClientMessageComponent"), {
  ssr: false // 서버 사이드 렌더링을 비활성화합니다.
});

export default function MessagePage() {
  return (
    <div className="container mx-auto max-w-4xl p-4">
      <h1 className="mb-4 text-2xl font-bold">메시지</h1>
      <Suspense fallback={<div className="p-4 text-center">로딩 중...</div>}>
        <ClientMessageComponent />
      </Suspense>
    </div>
  );
}
