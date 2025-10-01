import { Suspense } from "react";
import LetterContent from "./LetterContent";

export default function LetterPage({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
    <Suspense
      fallback={
        <div className='h-dvh flex items-center justify-center bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400'>
          <div className='text-white text-lg'>Loading letter...</div>
        </div>
      }>
      <LetterContent id={id} />
    </Suspense>
  );
}
