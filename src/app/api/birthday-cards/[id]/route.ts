import { NextRequest, NextResponse } from "next/server";
import BirthdayCard from "@/models/BirthdayCard";
import connectDB from "@/lib/mongodb";

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

    return NextResponse.json(card);
  } catch (error) {
    console.error("Error fetching birthday card:", error);
    return NextResponse.json(
      { error: "Error fetching birthday card" },
      { status: 500 }
    );
  }
}
