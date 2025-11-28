import express from "express";
import router from "./routes/user.js";
import { connectMongoDB } from "./connect.js";
import "dotenv/config"

const app = express()
const PORT =process.env.PORT
connectMongoDB(process.env.MONGO_DB)
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/user',router)


app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})