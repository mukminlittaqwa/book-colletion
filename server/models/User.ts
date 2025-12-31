import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema, model, models } = mongoose;
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  bookmarks: [{ type: Schema.Types.ObjectId, ref: "Book" }],
  myCollections: [{ type: Schema.Types.ObjectId, ref: "Book" }],
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

export const User = models.User || model("User", UserSchema);
