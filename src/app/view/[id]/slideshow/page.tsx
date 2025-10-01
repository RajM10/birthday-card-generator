"use client";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImageSS from "@/components/ImageSS";
import { useParams } from "next/navigation";
import { cardStorage } from "@/lib/cardStorage";
import { themeStyles } from "@/lib/themeStyles";

export default function SlideShow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { id } = useParams();
  const card = cardStorage.getCardById(id as string);
  const length = card?.messages.length || 1;
  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % length);
    }, 10000);
  }, [length]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startTimer]);
  if (!id) return null;
  const goToNext = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setCurrentIndex((prev) => (prev + 1) % length);
    startTimer();
  };

  const goToPrevious = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setCurrentIndex((prev) => (prev - 1 + length) % length);
    startTimer();
  };

  return (
    <div
      className={`h-dvh w-dvw snap-start flex items-center justify-center relative bg-gradient-to-br ${themeStyles[card?.theme || "friend"].gradient}`}>
      <ImageSS
        currentIndex={currentIndex}
        id={id as string}
      />

      {/* Progress bar */}
      <div className='absolute top-4 left-1/2 -translate-x-1/2 w-[min(600px,70vw)] h-2 bg-gray-200 rounded-full overflow-hidden'>
        <motion.div
          className='h-full bg-purple-500'
          initial={{ width: "0%" }}
          animate={{ width: `${((currentIndex + 1) / length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Enhanced Navigation Buttons */}
      <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4'>
        <SlideShowBtn onPress={goToPrevious}>
          <ChevronLeft />
        </SlideShowBtn>
        <SlideShowBtn onPress={goToNext}>
          <ChevronRight />
        </SlideShowBtn>
      </div>

      {/* Letter Page Button */}
      {card?.message && (
        <motion.a
          href={`/view/${id}/letter`}
          className='absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl shadow-lg transition-all'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}>
          View Letter
        </motion.a>
      )}
    </div>
  );
}

function SlideShowBtn({
  children,
  onPress,
}: {
  children: ReactNode;
  onPress: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.8 }}
      onClick={onPress}
      className='bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl shadow-lg p-3  transition-all'
      aria-label='Next slide'>
      {children}
    </motion.button>
  );
}
