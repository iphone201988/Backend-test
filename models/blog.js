import { model, Schema } from "mongoose";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    uploads: {
      type: [String],
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",         
        required: true,
      }
  },
  { timestamps: true }
);

export const Blog = model("blog",blogSchema)