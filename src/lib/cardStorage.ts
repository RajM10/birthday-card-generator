export interface Message {
  wish: string;
  image: string;
}

export interface BirthdayCard {
  _id?: string;
  name: string;
  message: string;
  theme: "family" | "friend" | "love";
  showSlideshow: boolean;
  messages: Message[];
  senderName: string;
  createdAt?: string;
}

const STORAGE_KEY = "birthday_cards";

export const cardStorage = {
  saveCard: (card: BirthdayCard) => {
    if (typeof window !== "undefined" && card._id) {
      const existingCards = cardStorage.getAllCards();
      const existingIndex = existingCards.findIndex((c) => c._id === card._id);

      if (existingIndex >= 0) {
        // Update existing card
        existingCards[existingIndex] = card;
      } else {
        // Add new card
        existingCards.push(card);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingCards));
    }
  },

  getAllCards: (): BirthdayCard[] => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    }
    return [];
  },

  getCardById: (id: string): BirthdayCard | null => {
    if (typeof window !== "undefined") {
      const cards = cardStorage.getAllCards();
      return cards.find((card) => card._id === id) || null;
    }
    return null;
  },

  clearCards: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  removeCard: (id: string) => {
    if (typeof window !== "undefined") {
      const cards = cardStorage.getAllCards();
      const filteredCards = cards.filter((card) => card._id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCards));
    }
  },
};
