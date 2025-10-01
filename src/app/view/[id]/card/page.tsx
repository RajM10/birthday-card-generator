"use client";
import { Sparkles, Star } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { cardStorage } from "@/lib/cardStorage";
import { themeStyles } from "@/lib/themeStyles";

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  rotation: number;
}

function HeartParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  const createParticle = useCallback(() => {
    const isMobile = window.innerWidth < 768;
    return {
      x: Math.random() * window.innerWidth,
      y: -20,
      size: isMobile ? Math.random() * 12 + 8 : Math.random() * 20 + 10,
      speed: isMobile ? Math.random() * 1.5 + 0.5 : Math.random() * 2 + 1,
      rotation: Math.random() * 360,
    };
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const interval = setInterval(
      () => {
        setParticles((prev) => {
          const newParticles = [...prev, createParticle()];
          // Limit the number of particles based on screen size
          const maxParticles = isMobile ? 15 : 30;
          return newParticles
            .filter((p) => p.y < window.innerHeight)
            .slice(-maxParticles);
        });
      },
      isMobile ? 300 : 200
    ); // Slower spawn rate on mobile

    return () => clearInterval(interval);
  }, [createParticle]);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          y: p.y + p.speed,
          rotation: p.rotation + 1,
        }))
      );
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [particles]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setParticles([]); // Clear particles on resize
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className='fixed inset-0 pointer-events-none overflow-hidden'>
      {particles.map((particle, index) => (
        <div
          key={index}
          className='absolute text-pink-500'
          style={{
            left: particle.x,
            top: particle.y,
            transform: `rotate(${particle.rotation}deg)`,
            fontSize: `${particle.size}px`,
            willChange: "transform", // Optimize for animations
          }}>
          {index % 2 === 0 ? (
            <Sparkles className='fill-yellow-400' />
          ) : (
            <Star className='fill-yellow-400' />
          )}
        </div>
      ))}
    </div>
  );
}

export default function GiftPage() {
  const TIMER = 3;
  const { id } = useParams();
  const [showHint, setShowHint] = useState<boolean>(false);
  const [card, setCard] = useState(cardStorage.getCardById(id as string));

  useEffect(() => {
    const timerId = setTimeout(() => {
      setShowHint(true);
    }, TIMER * 1000);
    return () => {
      clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    async function fetchCard() {
      try {
        const response = await fetch(`/api/birthday-cards/${id}`);
        if (!response.ok) throw new Error("Failed to fetch card");
        const data = await response.json();
        setCard(data);
      } catch (error) {
        console.error("Error fetching card:", error);
      }
    }
    if (!card) fetchCard();
  }, [id, card]);

  const router = useRouter();

  if (!card) return null;

  return (
    <div
      className={`max-h-dvh relative h-dvh flex flex-col items-center justify-between bg-gradient-to-br ${
        themeStyles[card.theme].gradient
      }`}>
      <HeartParticles />
      {/* Cover at the top */}
      <div className='w-full flex gap-2 pt-6'>
        <div className="top-0 fixed translate-y-[-20%] left-0 right-0 mx-auto  w-dvw h-32 bg-[url('/asset/cover.png')] bg-contain bg-repeat-x z-20" />
        <div className="top-0 fixed translate-x-[50%] translate-y-[-50%] left-0 right-0 mx-auto  w-dvw h-32 bg-[url('/asset/cover.png')] bg-contain bg-repeat-x z-30" />
        <div className="top-0 fixed translate-x-[-50%] translate-y-[-50%] left-0 right-0 mx-auto  w-dvw h-32 bg-[url('/asset/cover.png')] bg-contain bg-repeat-x z-10" />
      </div>

      {/* Happy Birthday SVG in the center */}
      <div className='flex-1 flex items-center justify-center'>
        <Image
          src='/asset/HappyBirthday.svg'
          alt='Happy Birthday'
          priority={true}
          width={600}
          height={600}
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* Gift image near the bottom */}
      <div className='w-full fixed bottom-0 transform flex justify-center animate-shake'>
        {showHint && (
          <div
            className={`text-2xl font-semibold ${themeStyles[card.theme].accent} cursor-pointer fixed top-1/2 animate-bounce`}
            onClick={() => {
              router.push(`/view/${id}/slideshow`);
            }}>
            Click the Gift!
          </div>
        )}
        <Image
          className='cursor-pointer'
          onClick={() => {
            router.push(`/view/${id}/slideshow`);
          }}
          src='/asset/gift.png'
          alt='gift'
          width={300}
          height={300}
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
}

// Add the animation keyframes at the end of the file
const styles = `
  @keyframes shake {
    0%, 100% { transform: translateY(35%) rotate(0deg); }
    25% { transform: translateY(35%) rotate(-2deg); }
    75% { transform: translateY(35%) rotate(2deg); }
  }
  .animate-shake {
    animation: shake 2s ease-in-out infinite;
  }
`;

// Add the styles to the document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
