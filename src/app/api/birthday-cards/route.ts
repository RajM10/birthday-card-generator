import { NextRequest, NextResponse } from "next/server";
import BirthdayCard from "@/models/BirthdayCard";
import connectDB from "@/lib/mongodb";
import { encrypt, decrypt } from "@/lib/encryption";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      name,
      senderName,
      message,
      theme = "friend",
      showSlideshow = false,
      messages = [],
    } = body;

    if (!name || !senderName || !message) {
      return NextResponse.json(
        {
          error: "Name, sender name, and message are required",
        },
        { status: 400 }
      );
    }

    if (!["family", "friend", "love"].includes(theme)) {
      return NextResponse.json(
        {
          error: "Invalid theme. Must be 'family', 'friend', or 'love'",
        },
        { status: 400 }
      );
    }

    let validatedMessages: { wish: string; image: string }[] = [];
    if (showSlideshow) {
      if (!Array.isArray(messages)) {
        return NextResponse.json(
          { error: "Messages must be an array when slideshow is enabled" },
          { status: 400 }
        );
      }

      if (messages.length > 5) {
        return NextResponse.json(
          { error: "Maximum 5 slides allowed" },
          { status: 400 }
        );
      }

      validatedMessages = messages
        .map((msg) => ({
          wish: msg.wish ? encrypt(msg.wish) : "",
          image: msg.image || "",
        }))
        .filter((msg) => msg.wish || msg.image);
    }

    const birthdayCard = await BirthdayCard.create({
      name: encrypt(name),
      senderName: encrypt(senderName),
      message: encrypt(message),
      theme,
      showSlideshow,
      messages: validatedMessages,
    });

    return NextResponse.json(birthdayCard, { status: 201 });
  } catch (error) {
    console.error("Error creating birthday card:", error);
    return NextResponse.json(
      { error: "Error creating birthday card" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const birthdayCards = await BirthdayCard.find({}).sort({ createdAt: -1 });

    const decryptedCards = birthdayCards.map((card) => ({
      ...card.toObject(),
      name: decrypt(card.name),
      senderName: decrypt(card.senderName),
      message: decrypt(card.message),
      messages: card.messages.map((msg: { wish: string; image: string }) => ({
        wish: msg.wish ? decrypt(msg.wish) : "",
        image: msg.image,
      })),
    }));

    return NextResponse.json(decryptedCards);
  } catch (error) {
    console.error("Error fetching birthday cards:", error);
    return NextResponse.json(
      { error: "Error fetching birthday cards" },
      { status: 500 }
    );
  }
}
