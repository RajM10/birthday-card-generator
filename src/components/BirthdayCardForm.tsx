"use client";
import Input from "@/app/ui/Input";
import { cardStorage, BirthdayCard } from "@/lib/cardStorage";
import { Theme, themeStyles } from "@/lib/themeStyles";
import { ImageIcon, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface BirthdayCardFormProps {
  card?: BirthdayCard;
}

interface Message {
  wish: string;
  image: string;
  uploading?: boolean;
}

interface FormData {
  name: string;
  senderName: string;
  message: string;
  theme: Theme;
  showSlideshow: boolean;
  messages: Message[];
}

export default function BirthdayCardForm({ card }: BirthdayCardFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: card?.name || "",
    senderName: card?.senderName || "",
    message: card?.message || "",
    theme: card?.theme || "friend",
    showSlideshow: card?.showSlideshow || false,
    messages: card?.messages || [],
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function uploadFile(file: File): Promise<string> {
    try {
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File size must be less than 10MB");
      }
      if (!file.type.startsWith("image/")) {
        throw new Error("File must be an image");
      }
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(error instanceof Error ? error.message : "Error uploading file");
      throw error;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validMessages = formData.showSlideshow
        ? formData.messages.filter((msg) => msg.wish || msg.image)
        : [];

      if (validMessages.length > 5) {
        alert("Maximum 5 slides allowed in the slideshow");
        setLoading(false);
        return;
      }

      const apiEndpoint = card
        ? `/api/birthday-cards/${card._id}`
        : "/api/birthday-cards";
      const method = card ? "PUT" : "POST";

      const response = await fetch(apiEndpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, messages: validMessages }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${card ? "update" : "create"} birthday card`,
        );
      }

      const data = await response.json();

      cardStorage.saveCard({
        ...formData,
        _id: data._id,
        messages: validMessages,
        createdAt: card?.createdAt || new Date().toISOString(),
      });

      if (card) {
        router.push(`/`);
      } else {
        router.push(`/create/success?id=${data._id}`);
      }
    } catch (err) {
      console.error(
        `Error ${card ? "updating" : "creating"} birthday card:`,
        err,
      );
      alert(
        `Error ${card ? "updating" : "creating"} birthday card. Please try again.`,
      );
    } finally {
      setLoading(false);
    }
  };

  const currentTheme = themeStyles[formData.theme];

  return (
    <div
      className={`min-h-screen flex justify-center items-center bg-gradient-to-br ${currentTheme.gradient} relative overflow-hidden p-4 transition-all duration-500`}
    >
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white text-center mb-10">
              {card ? "Edit Birthday Card" : "Create a New Card"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Your Name"
                type="text"
                value={formData.senderName}
                onChange={(e) =>
                  setFormData({ ...formData, senderName: e.target.value })
                }
                required
                placeholder="Enter your name"
                description="This is who the card is from."
              />
              <Input
                label="Recipient's Name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                placeholder="E.g., Mom, Dad, a friend's name"
                description="This is who the card is for."
              />
            </div>
            <Input
              label="Your Birthday Wish"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
              placeholder="Write a heartfelt message..."
              multiline
              description="This is the main message that will be displayed on the card."
            />
            <div>
              <label className="block text-white mb-3 font-medium">
                Choose a Theme
              </label>
              <div className="grid grid-cols-3 gap-4">
                {(Object.keys(themeStyles) as Theme[]).map((theme) => (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => setFormData({ ...formData, theme })}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      formData.theme === theme
                        ? "border-white scale-105 bg-white/20"
                        : "border-transparent bg-white/10 hover:bg-white/20"
                    } text-white capitalize font-semibold`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="flex items-center text-white font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showSlideshow}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      showSlideshow: e.target.checked,
                    })
                  }
                  className="w-5 h-5 mr-3 rounded text-pink-500 focus:ring-pink-500"
                />
                Add a Photo Slideshow (up to 5 slides)
              </label>
              <p className="text-white/60 text-sm mt-2">
                Create a slideshow with photos and messages for a more personal
                touch.
              </p>
            </div>
            {formData.showSlideshow && (
              <div className="space-y-6 bg-black/10 p-6 rounded-2xl">
                {formData.messages.map((message, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-white font-semibold">
                        Slide {index + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          const newMessages = [...formData.messages];
                          newMessages.splice(index, 1);
                          setFormData({ ...formData, messages: newMessages });
                        }}
                        className="text-white/70 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <textarea
                          value={message.wish}
                          onChange={(e) => {
                            const newMessages = [...formData.messages];
                            newMessages[index].wish = e.target.value;
                            setFormData({ ...formData, messages: newMessages });
                          }}
                          className="w-full h-full min-h-[120px] p-3 rounded-xl bg-white/10 border-2 border-transparent text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 resize-none"
                          placeholder="Add a memory or a special wish..."
                        />
                      </div>

                      <div className="w-full md:w-[150px] flex flex-col gap-2 items-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            try {
                              if (e.target.files?.[0]) {
                                const newMessages = [...formData.messages];
                                newMessages[index].uploading = true;
                                setFormData({
                                  ...formData,
                                  messages: newMessages,
                                });

                                const imageUrl = await uploadFile(
                                  e.target.files[0],
                                );

                                newMessages[index] = {
                                  ...newMessages[index],
                                  image: imageUrl,
                                  uploading: false,
                                };
                                setFormData({
                                  ...formData,
                                  messages: newMessages,
                                });
                              }
                            } catch {
                              const newMessages = [...formData.messages];
                              newMessages[index].uploading = false;
                              setFormData({
                                ...formData,
                                messages: newMessages,
                              });
                            }
                          }}
                          className="hidden"
                          id={`image-${index}`}
                        />
                        <label
                          htmlFor={`image-${index}`}
                          className={`aspect-square w-full max-w-[150px] rounded-xl bg-white/10 border-2 border-dashed border-white/30 overflow-hidden relative flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all duration-300 ${
                            message.uploading
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {message.image ? (
                            <Image
                              src={message.image}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              width={150}
                              height={150}
                            />
                          ) : (
                            <div className="text-center text-white/50">
                              <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                              <span className="text-sm">Add Image</span>
                            </div>
                          )}
                          {message.uploading && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-semibold">
                              Uploading...
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                ))}

                {formData.messages.length < 5 && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        messages: [
                          ...formData.messages,
                          { wish: "", image: "" },
                        ],
                      });
                    }}
                    className="flex items-center justify-center w-full p-4 rounded-xl bg-white/10 border-2 border-dashed border-white/30 text-white hover:bg-white/20 transition-all duration-300"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Another Slide
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-4 rounded-full bg-white text-pink-600 font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${currentTheme.shadow} ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading
              ? card
                ? "Updating Your Card..."
                : "Creating Your Card..."
              : card
                ? "Update Birthday Card"
                : "Create Birthday Card"}
          </button>
        </form>
      </div>
    </div>
  );
}
