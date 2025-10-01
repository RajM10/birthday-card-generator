"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cardStorage, BirthdayCard } from "@/lib/cardStorage";
import { message } from "@/const/Message";

function WishPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [card, setCard] = useState<BirthdayCard | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timer = 15;

  useEffect(() => {
    const cardData = cardStorage.getCard();
    if (!cardData || cardData._id !== params.id) {
      router.replace(`/view/${params.id}`);
      return;
    }
    setCard(cardData);
  }, [params.id, router]);

  // Your existing fireworks and animation code here...

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400">
        <div className="animate-pulse text-white text-xl">Loading wishes... ✨</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Birthday Wishes for {card.name} 🎉
            </h1>
            <div className="text-pink-100 text-sm">
              With love, on {new Date(card.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Canvas for fireworks */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />

          <div className="space-y-8 relative z-10">
            {card.messages.map((message, index) => (
              <div 
                key={index}
                className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10 transform transition-all hover:scale-[1.02]"
              >
                {message.image && (
                  <div className="mb-4 rounded-xl overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={message.image} 
                      alt={`Birthday wish ${index + 1}`}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}
                {message.wish && (
                  <p className="text-white text-lg leading-relaxed">
                    {message.wish}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center space-y-4">
            <button
              onClick={() => router.push(`/view/${params.id}/cake`)}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-all mx-2"
            >
              Back to Cake
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-all mx-2"
            >
              Create Your Own Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WishPage;