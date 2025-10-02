import { NextRequest, NextResponse } from "next/server";
import BirthdayCard from "@/models/BirthdayCard";
import connectDB from "@/lib/mongodb";
import { encrypt, decrypt } from "@/lib/encryption";
import { param } from "framer-motion/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    const card = await BirthdayCard.findById(id);

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const decryptedCard = {
      ...card.toObject(),
      name: decrypt(card.name),
      senderName: decrypt(card.senderName),
      message: decrypt(card.message),
      messages: card.messages.map((msg: { wish: string; image: string }) => ({
        wish: msg.wish ? decrypt(msg.wish) : "",
        image: msg.image,
      })),
    };

    return NextResponse.json(decryptedCard);
  } catch (error) {
    console.error("Error fetching card:", error);
    return NextResponse.json({ error: "Error fetching card" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await req.json();
    const {
      name,
      senderName,
      message,
      theme,
      showSlideshow,
      messages = [],
    } = body;

    if (!name || !senderName || !message) {
      return NextResponse.json(
        {
          error: "Name, sender name, and message are required",
        },
        { status: 400 },
      );
    }

    const validatedMessages = messages
      .map((msg: { wish: string; image: string }) => ({
        wish: msg.wish ? encrypt(msg.wish) : "",
        image: msg.image || "",
      }))
      .filter((msg: { wish: string; image: string }) => msg.wish || msg.image);

    const updatedCard = await BirthdayCard.findByIdAndUpdate(
      id,
      {
        name: encrypt(name),
        senderName: encrypt(senderName),
        message: encrypt(message),
        theme,
        showSlideshow,
        messages: validatedMessages,
      },
      { new: true, runValidators: true },
    );

    if (!updatedCard) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error("Error updating card:", error);
    return NextResponse.json({ error: "Error updating card" }, { status: 500 });
  }
}

export async function DELETE(
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectDB();
    const deletedCard = await BirthdayCard.findByIdAndDelete(id);

    if (!deletedCard) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error("Error deleting card:", error);
    return NextResponse.json({ error: "Error deleting card" }, { status: 500 });
  }
}
