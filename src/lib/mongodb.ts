import { connection, connect } from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI;

export default async function connectDB() {
  try {
    if (connection.readyState >= 1) {
      return;
    }

    if (!MONGODB_URI) {
      throw new Error(
        "Please define the MONGODB_URI environment variable inside .env"
      );
    }
    await connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
