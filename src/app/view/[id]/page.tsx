"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { cardStorage } from "@/lib/cardStorage";

export default function ViewPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  useEffect(() => {
    async function fetchAndRedirect() {
      try {
        // Fetch the card data regardless of local storage
        const response = await fetch(`/api/birthday-cards/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch card");
        }
        const data = await response.json();

        // Save to localStorage
        cardStorage.saveCard({
          ...data,
          theme: data.theme || "friend", // Default theme if not present
          showSlideshow: !!data.messages?.length, // Enable slideshow if there are messages
          senderName: data.senderName || "Someone special", // Default sender name if not present
        });

        // Determine where to redirect based on the card data
        if (data.showSlideshow && data.messages?.length > 0) {
          router.replace(`/view/${params.id}/slideshow`);
        } else {
          router.replace(`/view/${params.id}/cake`);
        }
      } catch (error) {
        console.error("Error:", error);
        router.replace("/error"); // Redirect to error page
      }
    }

    fetchAndRedirect();
  }, [params.id, router]);

  // Show loading state while redirecting
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400'>
      <div className='animate-pulse text-white text-xl'>
        Loading your special surprise... 🎉
      </div>
    </div>
  );
}
