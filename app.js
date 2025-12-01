import express from "express";
import router from "./routes/user.js";
import blogRouter from "./routes/blog.js";
import { connectMongoDB } from "./connect.js";
import "dotenv/config"

const app = express()
const PORT =process.env.PORT
connectMongoDB(process.env.MONGO_DB)
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/user',router)
app.use('/blog',blogRouter)

app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})