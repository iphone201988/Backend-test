import { model,Schema } from "mongoose";

const accessorieSchema = new Schema({
  accessorieName: {
    type: String,
    required: true,
  },
  accessorieDetail: {
    type: String,
    required: true,
  },
  accessoriePrice:{
    type:Number,
    required:true
  },
  accessorieImage:{
    type:[String]
  },
  userId:{
    type:Schema.Types.ObjectId,
    ref:"user",
    required:true
  }
},{timestamps:true});

export const Accessorie = model("accessorie",accessorieSchema)
