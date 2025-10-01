export type Theme = "family" | "friend" | "love";

interface ThemeStyles {
  gradient: string;
  button: string;
  accent: string;
  background: string;
}

export const themeStyles: Record<Theme, ThemeStyles> = {
  family: {
    gradient: "from-amber-400 via-orange-400 to-red-400",
    button: "from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600",
    accent: "text-amber-200",
    background: "from-amber-50 to-red-50",
  },
  friend: {
    gradient: "from-pink-400 via-purple-400 to-indigo-400",
    button:
      "from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600",
    accent: "text-pink-200",
    background: "from-blue-50 to-purple-50",
  },
  love: {
    gradient: "from-rose-400 via-red-400 to-pink-400",
    button: "from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600",
    accent: "text-rose-200",
    background: "from-rose-50 to-pink-50",
  },
};
