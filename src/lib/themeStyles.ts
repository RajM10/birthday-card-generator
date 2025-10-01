export type Theme = "family" | "friend" | "love";

export interface ThemeStyles {
  gradient: string;
  button: string;
  accent: string;
  background: string;
  text: string;
  card: string;
  cardText: string;
  shadow: string;
}

export const themeStyles: Record<Theme, ThemeStyles> = {
  family: {
    gradient: "from-amber-400 via-orange-500 to-red-500",
    button: "from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600",
    accent: "text-amber-200",
    background: "bg-amber-50",
    text: "text-amber-900",
    card: "bg-white/70 border-amber-200",
    cardText: "text-amber-900",
    shadow: "shadow-amber-500/30",
  },
  friend: {
    gradient: "from-pink-400 via-purple-400 to-indigo-500",
    button:
      "from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600",
    accent: "text-pink-200",
    background: "bg-indigo-50",
    text: "text-indigo-900",
    card: "bg-white/70 border-purple-200",
    cardText: "text-indigo-900",
    shadow: "shadow-purple-500/30",
  },
  love: {
    gradient: "from-rose-400 via-red-500 to-pink-500",
    button: "from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600",
    accent: "text-rose-200",
    background: "bg-rose-50",
    text: "text-rose-900",
    card: "bg-white/70 border-red-200",
    cardText: "text-rose-900",
    shadow: "shadow-red-500/30",
  },
};
