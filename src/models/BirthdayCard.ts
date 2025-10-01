import mongoose from "mongoose";

const birthdayCardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a recipient name"],
    trim: true,
  },
  message: {
    type: String,
    required: [true, "Please write your birthday wish"],
  },
  theme: {
    type: String,
    enum: ["family", "friend", "love"],
    default: "friend",
  },
  showSlideshow: {
    type: Boolean,
    default: false,
  },
  messages: [
    {
      wish: {
        type: String,
        required: false,
      },
      image: {
        type: String,
        required: false,
      },
    },
  ],
  senderName: {
    type: String,
    required: [true, "Please provide your name"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.BirthdayCard ||
  mongoose.model("BirthdayCard", birthdayCardSchema);
