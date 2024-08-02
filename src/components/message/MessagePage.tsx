import { Suspense } from "react";
import ClientMessageComponent from "./ClientMessageComponent";

export default function MessagePage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">로딩 중...</div>}>
      <ClientMessageComponent />
    </Suspense>
  );
}
