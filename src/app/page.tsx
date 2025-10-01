"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, ArrowRight } from "lucide-react";
import { cardStorage, BirthdayCard } from "@/lib/cardStorage";
import { themeStyles } from "@/lib/themeStyles";
import { InfoSidebar } from "./ui/InfoSidebar";

export default function DashboardPage() {
  const [cards, setCards] = useState<BirthdayCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<"friend" | "family" | "love">("friend");

  useEffect(() => {
    cardStorage.autoRemoveOldCards();
    const loadedCards = cardStorage.getAllCards();
    setCards(loadedCards);
    setLoading(false);
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this card?")) {
      const updatedCards = cards.filter((card) => card._id !== id);
      setCards(updatedCards);
      cardStorage.removeCard(id);

      try {
        await fetch(`/api/birthday-cards/${id}`, { method: "DELETE" });
      } catch (err) {
        console.error("Error deleting card from server:", err);
      }
    }
  };

  const currentTheme = themeStyles[theme];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} transition-all duration-500`}
    >
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          <InfoSidebar />
          <div className="flex-1">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-8 border-b border-white/20">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-white">
                  Birthday Card Dashboard
                </h1>
                <p className={`mt-2 text-lg ${currentTheme.accent}`}>
                  Create, manage, and share personalized birthday cards.
                </p>
              </div>
              <Link
                href="/create"
                className={`inline-flex items-center gap-3 bg-white/20 text-white px-6 py-3 rounded-full font-semibold text-md shadow-lg hover:bg-white/30 transition-all duration-300 transform hover:scale-105 ${currentTheme.shadow}`}
              >
                <Plus size={20} />
                Create New Card
              </Link>
            </div>

            {/* Cards Grid Section */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Your Cards</h2>
              {loading ? (
                <p className="text-white/80">Loading cards...</p>
              ) : cards.length === 0 ? (
                <div className="text-center py-20 px-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20">
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    No Cards Yet!
                  </h3>
                  <p className="text-white/70 mb-8 max-w-md mx-auto">
                    Start creating memories. Your beautifully designed birthday
                    cards will appear here.
                  </p>
                  <Link
                    href="/create"
                    className={`inline-flex items-center gap-3 bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105`}
                  >
                    Create Your First Card
                    <ArrowRight size={20} />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {cards.map((card) => (
                    <div
                      key={card._id}
                      className={`bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                        themeStyles[card.theme].shadow
                      }`}
                    >
                      <div className="p-6 flex-grow">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-white truncate">
                            To: {card.name}
                          </h3>
                          <span
                            className={`px-3 py-1 text-sm font-semibold rounded-full bg-white/30 text-white`}
                          >
                            {card.theme}
                          </span>
                        </div>
                        <p className="text-md text-white/80 mb-5">
                          From: {card.senderName}
                        </p>
                        <p className="text-xs text-white/60">
                          Created:{" "}
                          {card.createdAt
                            ? new Date(card.createdAt).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      <div className="bg-black/20 px-6 py-4 flex justify-end items-center gap-4">
                        <Link
                          href={`/view/${card._id}/`}
                          className="text-white/70 hover:text-white transition-colors"
                          title="View"
                        >
                          <Eye size={22} />
                        </Link>
                        <Link
                          href={`/edit/${card._id}`}
                          className="text-white/70 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit size={22} />
                        </Link>
                        <button
                          onClick={() => handleDelete(card._id!)}
                          className="text-white/70 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={22} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
