import { NextRequest, NextResponse } from "next/server";
import BirthdayCard from "@/models/BirthdayCard";
import connectDB from "@/lib/mongodb";
import { decrypt } from "@/lib/encryption";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const card = await BirthdayCard.findById(id);

    if (!card) {
      return NextResponse.json(
        { error: "Birthday card not found" },
        { status: 404 }
      );
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
    console.error("Error fetching birthday card:", error);
    return NextResponse.json(
      { error: "Error fetching birthday card" },
      { status: 500 }
    );
  }
}
