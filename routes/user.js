import express from "express";

import { registerUser,userLogIn,getAllUser,getUser,updateUser,deleteUser } from "../controllers/user.js";
import { upload } from "../middleware/multer.js";
import { authorization } from "../middleware/authorization.js";

const router = express.Router()

router.post('/registerUser',upload.single("image"),registerUser)
router.post('/login',userLogIn)

router.get('/getAllUser',authorization,getAllUser)
router.get('/getUser',authorization,getUser)

router.put('/updateUser',authorization,updateUser)

router.delete('/deleteUser',authorization,deleteUser)
export default router 