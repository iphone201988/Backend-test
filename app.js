import express from "express";
import router from "./routes/user.js";

const app = express()
const PORT =2000

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/user',router)

import { connectMongoDB } from "./connect.js";
connectMongoDB("mongodb+srv://khush:khush9878@khush.zmabp3r.mongodb.net/Backend-Test")

app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})