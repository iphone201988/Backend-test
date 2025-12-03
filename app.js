import express from "express";
import router from "./routes/user.js";
import blogRouter from "./routes/blog.js";
import productRouter from "./routes/product.js";
import accessorieRouter from "./routes/accessorie.js"
import { connectMongoDB } from "./connect.js";
import "dotenv/config"
import cors from "cors"
import path from "path"


const app = express()
app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    credentials: false,
  }))
const PORT =process.env.PORT
connectMongoDB(process.env.MONGO_DB)
app.use("/image", express.static(path.join(process.cwd(), "public/image")));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/user',router)
app.use('/blog',blogRouter)
app.use('/product',productRouter)
app.use('/accessorie',accessorieRouter)

app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})