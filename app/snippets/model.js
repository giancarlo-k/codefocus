import mongoose from "mongoose";

const snippetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  language: { type: String, required: true },
  createdAt: { type: String, required: true },
  createdAtFormatted: { type: String, required: true },
  username: { type: String, required: true },
  tags: { type: [String], required: true },
  favorite: { type: Boolean, required: true },
  code: { type: String, required: false },
  lastSaved: { type: String, required: false },
  lineCount: { type: Number, required: false},
})

export const Snippet = mongoose.model('Snippet', snippetSchema);