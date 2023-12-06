import mongoose from "mongoose";

export const chatModels = mongoose.model(
  "messages",
  new mongoose.Schema(
    {
      emisor: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
    { timestamps: true }
  )
);
