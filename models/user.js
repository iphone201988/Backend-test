import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    age:{
      type:Number,
    },
    publicProfile: {
      type: String,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    userId:{
      type: Schema.Types.ObjectId, ref:"user"
    }
  },
  { timestamps: true }
);

export const User = model("user",userSchema)