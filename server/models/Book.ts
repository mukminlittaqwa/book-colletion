import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const BookSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  badge: String,
  date: { type: Date, default: Date.now },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const Book = models.Book || model("Book", BookSchema);
