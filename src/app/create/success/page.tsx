import { Suspense } from "react";
import SuccessContent from "./SuccessContent";

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500'>
          <div className='text-white text-lg'>Loading...</div>
        </div>
      }>
      <SuccessContent />
    </Suspense>
  );
}
