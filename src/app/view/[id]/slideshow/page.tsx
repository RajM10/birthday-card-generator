"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImageSS from "@/components/ImageSS";
import { message } from "@/const/Message";

const images = message.images;

export default function SlideShow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 10000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const goToNext = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setCurrentIndex((prev) => (prev + 1) % images.length);
    startTimer();
  };

  const goToPrevious = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    startTimer();
  };

  return (
    <div className='h-dvh w-dvw snap-start flex items-center justify-center relative bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400'>
      <ImageSS currentIndex={currentIndex} />

      {/* Progress bar */}
      <div className='absolute top-4 left-1/2 -translate-x-1/2 w-[min(600px,70vw)] h-2 bg-gray-200 rounded-full overflow-hidden'>
        <motion.div
          className='h-full bg-purple-500'
          initial={{ width: "0%" }}
          animate={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
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
