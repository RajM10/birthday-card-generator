"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BirthdayCardForm, { BirthdayCardFormProps } from "@/components/BirthdayCardForm";
import { cardStorage, BirthdayCard } from "@/lib/cardStorage";

export default function EditPage() {
  const { id } = useParams();
  const [card, setCard] = useState<BirthdayCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    // First, try to get the card from local storage
    const localCard = cardStorage.getCardById(id as string);
    if (localCard) {
      setCard(localCard);
      setLoading(false);
    } else {
      // If not in local storage, fetch from the API
      async function fetchCard() {
        try {
          const res = await fetch(`/api/birthday-cards/${id}`);
          if (!res.ok) {
            throw new Error("Failed to fetch card data");
          }
          const data = await res.json();
          setCard(data);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "An unknown error occurred",
          );
        } finally {
          setLoading(false);
        }
      }
      fetchCard();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Loading for Edit...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Card not found.</p>
      </div>
    );
  }

  return (
    <main>
      <BirthdayCardForm card={card} />
    </main>
  );
}
