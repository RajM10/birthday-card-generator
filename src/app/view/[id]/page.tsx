"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { cardStorage } from "@/lib/cardStorage";
import BirthdayCake from "@/components/BirthdayCake";

export default function ViewPage() {
  const router = useRouter();

  const { id } = useParams();
  useEffect(() => {
    async function fetchAndRedirect() {
      try {
        // Fetch the card data regardless of local storage
        const response = await fetch(`/api/birthday-cards/${id}`);
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
      } catch (error) {
        console.error("Error:", error);
        router.replace("/error"); // Redirect to error page
      }
    }

    fetchAndRedirect();
  }, [id, router]);

  // Show loading state while redirecting
  return <BirthdayCake />;
}
