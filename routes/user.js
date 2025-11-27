import express from "express";

import { registerUser,userLogIn } from "../controllers/user.js";

const router = express.Router()

router.post('/registerUser',registerUser)
router.post('/login',userLogIn)

export default router