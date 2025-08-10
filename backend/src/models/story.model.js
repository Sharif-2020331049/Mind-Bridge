
// story.model.js
import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  commentedAt: {
    type: Date,
    default: Date.now,
  },
});

const storySchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    story: { type: String, required: true },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);

export const Story = mongoose.model("Story", storySchema);
