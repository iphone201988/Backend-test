import { model,Schema } from "mongoose";

const productSchema = new Schema({
    productName:{
        type:String,
        required:true
    },
    productDetails:{
        type:String,
        required:true
    },
    productPrice:{
        type:Number,
        required:true
    },
    productImage:{
        type:[String]
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true
    }
},{timestamps:true})

export const Product = model("product",productSchema)