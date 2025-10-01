"use client";
import { useState } from "react";
import { HeartIcon, Plus, Trash2, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { themeStyles, type Theme } from '@/lib/themeStyles';
import { cardStorage, type Message } from '@/lib/cardStorage';

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
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error uploading file:", error);
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
        throw new Error('Failed to create birthday card');
      }

      const data = await response.json();
      
      // Save to local storage
      cardStorage.saveCard({
        ...formData,
        _id: data._id,
        messages: validMessages,
        createdAt: new Date().toISOString()
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
    <>
      <div className={`min-h-screen flex justify-center items-center bg-gradient-to-br ${themeStyles[formData.theme].gradient} relative overflow-hidden p-4`}>
        <div className='max-w-2xl w-full bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-4'>
              <h2 className='text-3xl font-bold text-white text-center mb-8'>Create Birthday Card</h2>
              
              <div>
                <label className='block text-white mb-2'>Your Name</label>
                <input
                  type='text'
                  value={formData.senderName}
                  onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                  required
                  className='w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50'
                  placeholder='Enter your name'
                />
              </div>

              <div>
                <label className='block text-white mb-2'>Recipient's Name</label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className='w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50'
                  placeholder="Enter recipient's name"
                />
              </div>

              <div>
                <label className='block text-white mb-2'>Birthday Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className='w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 min-h-[100px]'
                  placeholder='Write your birthday message'
                />
              </div>

              <div>
                <label className='block text-white mb-2'>Theme</label>
                <div className='grid grid-cols-3 gap-4'>
                  {(['friend', 'family', 'love'] as const).map((theme) => (
                    <button
                      key={theme}
                      type='button'
                      onClick={() => setFormData({ ...formData, theme })}
                      className={`p-4 rounded-xl border ${
                        formData.theme === theme
                          ? 'bg-white/20 border-white'
                          : 'bg-white/5 border-white/10'
                      } text-white capitalize transition-all`}
                    >
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
                    onChange={(e) => setFormData({ ...formData, showSlideshow: e.target.checked })}
                    className='mr-2'
                  />
                  Add Slideshow (up to 5 slides)
                </label>
              </div>

              {formData.showSlideshow && (
                <div className='space-y-4'>
                  {formData.messages.map((message, index) => (
                    <div key={index} className='p-4 bg-white/5 rounded-xl border border-white/10'>
                      <div className='flex justify-between items-center mb-2'>
                        <h3 className='text-white'>Slide {index + 1}</h3>
                        <button
                          type='button'
                          onClick={() => {
                            const newMessages = [...formData.messages];
                            newMessages.splice(index, 1);
                            setFormData({ ...formData, messages: newMessages });
                          }}
                          className='text-white/70 hover:text-white'
                        >
                          <Trash2 className='w-5 h-5' />
                        </button>
                      </div>
                      
                      <div className='space-y-3'>
                        <textarea
                          value={message.wish}
                          onChange={(e) => {
                            const newMessages = [...formData.messages];
                            newMessages[index].wish = e.target.value;
                            setFormData({ ...formData, messages: newMessages });
                          }}
                          className='w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50'
                          placeholder='Write a message for this slide'
                        />
                        
                        <div>
                          <input
                            type='file'
                            accept='image/*'
                            onChange={async (e) => {
                              try {
                                if (e.target.files?.[0]) {
                                  const imageUrl = await uploadFile(e.target.files[0]);
                                  const newMessages = [...formData.messages];
                                  newMessages[index].image = imageUrl;
                                  setFormData({ ...formData, messages: newMessages });
                                }
                              } catch {}
                            }}
                            className='hidden'
                            id={`image-${index}`}
                          />
                          <label
                            htmlFor={`image-${index}`}
                            className='flex items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 text-white cursor-pointer hover:bg-white/10'
                          >
                            <ImageIcon className='w-5 h-5 mr-2' />
                            {message.image ? 'Change Image' : 'Add Image'}
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
                          messages: [...formData.messages, { wish: '', image: '' }]
                        });
                      }}
                      className='flex items-center justify-center w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10'
                    >
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
              } text-white font-bold transition-all ${loading ? 'opacity-50' : ''}`}
            >
              {loading ? 'Creating...' : 'Create Birthday Card'}
            </button>
          </form>
        </div>
      </div>

      <div className='relative w-full max-w-md px-8'>
        <div className='bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20'>
          <div className='text-center mb-8'>
            <div className='flex justify-center mb-4'>
              <HeartIcon className='w-12 h-12 text-pink-200 animate-pulse' />
            </div>
            <h1 className='text-3xl font-bold text-white mb-2 text-shadow'>
              Birthday Card Generator
            </h1>
            <span className='text-pink-100 text-sm'>
              Create a special message for someone special ❤️
            </span>
          </div>

          <form
            onSubmit={handleSubmit}
            className='space-y-6'>
            {/* Name Input */}
            <div className='relative group'>
              <input
                type='text'
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className='w-full bg-white/5 text-white border-2 border-white/20 rounded-xl px-5 py-4 outline-none focus:border-pink-300/50 transition-all placeholder:text-white/40'
                placeholder="Enter recipient's name..."
              />
            </div>

            {/* Messages with Images */}
            {formData.messages.map((message, index) => (
              <div
                key={`message-${index}`}
                className='space-y-4'>
                <div className='relative group'>
                  <textarea
                    value={message.wish}
                    onChange={(e) => {
                      const newMessages = [...formData.messages];
                      newMessages[index] = {
                        ...newMessages[index],
                        wish: e.target.value,
                      };
                      setFormData({ ...formData, messages: newMessages });
                    }}
                    className='w-full bg-white/5 text-white border-2 border-white/20 rounded-xl px-5 py-4 outline-none focus:border-pink-300/50 transition-all placeholder:text-white/40 min-h-[100px]'
                    placeholder='Enter your birthday wish (optional)...'
                  />
                </div>

                <div className='flex gap-2'>
                  <div className='relative group flex-1'>
                    <div className='flex gap-2'>
                      <input
                        type='file'
                        accept='image/*'
                        className='hidden'
                        id={`file-${index}`}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const url = await uploadFile(file);
                              const newMessages = [...formData.messages];
                              newMessages[index] = {
                                ...newMessages[index],
                                image: url,
                              };
                              setFormData({
                                ...formData,
                                messages: newMessages,
                              });
                            } catch (error) {
                              alert(
                                "Failed to upload image. Please try again."
                              );
                            }
                          }
                        }}
                      />
                      <div className='flex-1 relative'>
                        <input
                          type='text'
                          value={message.image}
                          readOnly
                          className='w-full bg-white/5 text-white border-2 border-white/20 rounded-xl px-5 py-4 outline-none focus:border-pink-300/50 transition-all placeholder:text-white/40'
                          placeholder='Choose an image (optional)...'
                        />
                        <label
                          htmlFor={`file-${index}`}
                          className='absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg cursor-pointer'>
                          <ImageIcon className='w-5 h-5' />
                        </label>
                      </div>
                    </div>
                  </div>

                  {index > 0 && (
                    <button
                      type='button'
                      onClick={() => {
                        const newMessages = formData.messages.filter(
                          (_, i) => i !== index
                        );
                        setFormData({ ...formData, messages: newMessages });
                      }}
                      className='bg-red-400/20 hover:bg-red-400/40 text-white p-4 rounded-xl'>
                      <Trash2 className='w-5 h-5' />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {formData.messages.length < 5 && (
              <button
                type='button'
                onClick={() =>
                  setFormData({
                    ...formData,
                    messages: [...formData.messages, { wish: "", image: "" }],
                  })
                }
                className='w-full bg-white/5 hover:bg-white/10 text-white rounded-xl px-5 py-4 flex items-center justify-center gap-2'>
                <Plus className='w-5 h-5' /> Add Message with Image
              </button>
            )}

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl px-5 py-4 font-semibold
                transform transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg
                flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed'>
              {loading ? "Creating..." : "Generate Card"}
              <HeartIcon className='w-5 h-5 group-hover:scale-110 transition-transform' />
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
