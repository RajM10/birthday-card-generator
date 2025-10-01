"use client";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import LetterContent from "./LetterContent";

export default function LetterPage() {
  const { id } = useParams();
  return (
    <Suspense
      fallback={
        <div className="h-dvh flex items-center justify-center bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400">
          <div className="text-white text-lg">Loading letter...</div>
        </div>
      }
    >
      <LetterContent id={id as string} />
    </Suspense>
  );
}
