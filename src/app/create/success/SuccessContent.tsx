"use client";

import { useEffect, useState } from "react";
import { Check, Copy, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { cardStorage, type BirthdayCard } from "@/lib/cardStorage";
import { themeStyles } from "@/lib/themeStyles";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [card, setCard] = useState<BirthdayCard | null>(null);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      const cardData = cardStorage.getCardById(id);
      setCard(cardData);
    }
  }, [searchParams]);

  if (!card) {
    return null;
  }

  const cardUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/view/${card._id}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br ${
        themeStyles[card.theme].gradient
      } p-4`}>
      <div className='max-w-md w-full bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20 text-center'>
        <div className='mb-8'>
          <div className='w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6'>
            <Check className='w-8 h-8 text-white' />
          </div>
          <h2 className='text-2xl font-bold text-white mb-2'>
            Birthday Card Created!
          </h2>
          <p className='text-white/80'>
            Share the link below with {card.name}!
          </p>
        </div>

        <div className='space-y-4'>
          <button
            onClick={copyLink}
            className='w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center gap-2 hover:bg-white/20 transition-all'>
            {copied ? (
              <Check className='w-4 h-4' />
            ) : (
              <Copy className='w-4 h-4' />
            )}
            {copied ? "Copied!" : "Copy Link"}
          </button>

          <Link
            href={`/view/${card._id}`}
            className={`w-full p-4 rounded-xl bg-gradient-to-r ${
              themeStyles[card.theme].button
            } text-white flex items-center justify-center font-bold`}>
            View Card
            <ArrowRight className='w-5 h-5 ml-2' />
          </Link>
        </div>
      </div>
    </div>
  );
}