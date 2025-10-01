"use client";
import Input from "@/app/ui/Input";
import { cardStorage } from "@/lib/cardStorage";
import { Theme, themeStyles } from "@/lib/themeStyles";
import { ImageIcon, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

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

export default function BirthdayCardForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    senderName: "",
    message: "",
    theme: "friend",
    showSlideshow: false,
    messages: [],
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function uploadFile(file: File): Promise<string> {
    try {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File size must be less than 10MB");
      }

      // Check file type
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
      // Filter out empty messages if slideshow is enabled
      const validMessages = formData.showSlideshow
        ? formData.messages.filter((msg) => msg.wish || msg.image)
        : [];

      if (validMessages.length > 5) {
        alert("Maximum 5 slides allowed in the slideshow");
        return;
      }

      const response = await fetch("/api/birthday-cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          messages: validMessages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create birthday card");
      }

      const data = await response.json();

      // Save to local storage
      cardStorage.saveCard({
        ...formData,
        _id: data._id,
        messages: validMessages,
        createdAt: new Date().toISOString(),
      });

      // Redirect to success page
      router.push(`/create/success?id=${data._id}`);
    } catch (err) {
      console.error("Error creating birthday card:", err);
      alert("Error creating birthday card. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex justify-center items-center bg-gradient-to-br ${
        themeStyles[formData.theme].gradient
      } relative overflow-hidden p-4`}>
      <div className='max-w-2xl w-full bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20'>
        <form
          onSubmit={handleSubmit}
          className='space-y-6'>
          <div className='space-y-4'>
            <h2 className='text-3xl font-bold text-white text-center mb-8'>
              Create Birthday Card
            </h2>
            <Input
              label='Your Name'
              type='text'
              value={formData.senderName}
              onChange={(e) =>
                setFormData({ ...formData, senderName: e.target.value })
              }
              required
              placeholder='Enter your name'
            />
            <Input
              label="Recipient's Name or Relation(Mom,Dad)"
              type='text'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              placeholder="Enter recipient's name"
            />
            <Input
              label='Write small Wish'
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
              placeholder='Write your birthday message'
              multiline
            />
            <div>
              <label className='block text-white mb-2'>Theme</label>
              <div className='grid grid-cols-3 gap-4'>
                {(["friend", "family", "love"] as const).map((theme) => (
                  <button
                    key={theme}
                    type='button'
                    onClick={() => setFormData({ ...formData, theme })}
                    className={`p-4 rounded-xl border ${
                      formData.theme === theme
                        ? "bg-white/20 border-white"
                        : "bg-white/5 border-white/10"
                    } text-white capitalize transition-all`}>
                    {theme}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className='flex items-center text-white mb-4'>
                <input
                  type='checkbox'
                  checked={formData.showSlideshow}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      showSlideshow: e.target.checked,
                    })
                  }
                  className='mr-2'
                />
                Add Slideshow (up to 5 slides)
              </label>
            </div>
            {formData.showSlideshow && (
              <div className='space-y-4'>
                {formData.messages.map((message, index) => (
                  <div
                    key={index}
                    className='p-4 '>
                    <div className='flex justify-between items-center mb-2'>
                      <h3 className='text-white'>Slide {index + 1}</h3>
                      <button
                        type='button'
                        onClick={() => {
                          const newMessages = [...formData.messages];
                          newMessages.splice(index, 1);
                          setFormData({ ...formData, messages: newMessages });
                        }}
                        className='text-white/70 hover:text-white'>
                        <Trash2 className='w-5 h-5' />
                      </button>
                    </div>

                    <div className='flex gap-4'>
                      <div className='flex-1'>
                        <textarea
                          value={message.wish}
                          onChange={(e) => {
                            const newMessages = [...formData.messages];
                            newMessages[index].wish = e.target.value;
                            setFormData({ ...formData, messages: newMessages });
                          }}
                          className='w-full h-[150px] p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 resize-none outline-none'
                          placeholder='Write about that image memory or anything'
                        />
                      </div>

                      <div className='w-[150px] flex flex-col gap-2'>
                        <input
                          type='file'
                          accept='image/*'
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
                                  e.target.files[0]
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
                          className='hidden'
                          id={`image-${index}`}
                        />
                        <div className='aspect-square w-full rounded-xl bg-white/5 border border-white/10 overflow-hidden relative'>
                          {message.image ? (
                            <Image
                              src={message.image}
                              alt='Preview'
                              className='w-full h-full object-cover'
                              width={150}
                              height={150}
                            />
                          ) : (
                            <div className='w-full h-full flex items-center justify-center text-white/50'>
                              <ImageIcon className='w-8 h-8' />
                            </div>
                          )}
                          {message.uploading && (
                            <div className='absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm'>
                              Uploading...
                            </div>
                          )}
                        </div>
                        <label
                          htmlFor={`image-${index}`}
                          className={`flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 text-white cursor-pointer hover:bg-white/10 ${
                            message.uploading
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}>
                          <ImageIcon className='w-4 h-4 mr-2' />
                          {message.uploading
                            ? "Uploading..."
                            : message.image
                              ? "Change"
                              : "Add Image"}
                        </label>
                      </div>
                    </div>
                  </div>
                ))}

                {formData.messages.length < 5 && (
                  <button
                    type='button'
                    onClick={() => {
                      setFormData({
                        ...formData,
                        messages: [
                          ...formData.messages,
                          { wish: "", image: "" },
                        ],
                      });
                    }}
                    className='flex items-center justify-center w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10'>
                    <Plus className='w-5 h-5 mr-2' />
                    Add Slide
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            type='submit'
            disabled={loading}
            className={`w-full p-4 rounded-xl bg-gradient-to-r ${
              themeStyles[formData.theme].button
            } text-white font-bold transition-all ${
              loading ? "opacity-50" : ""
            }`}>
            {loading ? "Creating..." : "Create Birthday Card"}
          </button>
        </form>
      </div>
    </div>
  );
}
