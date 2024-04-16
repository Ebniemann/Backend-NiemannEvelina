import mongoose from "mongoose";

export const chatModels = mongoose.model(
  "messages",
  new mongoose.Schema(
    {
      emisor: {
        type: String,
      },
      message: {
        type: String,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
    { timestamps: true }
  )
);
