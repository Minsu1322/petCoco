import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const DynamicMateContent = dynamic(() => import('../mate/_components/mateContent'), {
  ssr: false,
});

export default function MatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicMateContent />
    </Suspense>
  );
}