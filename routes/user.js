import express from "express";

import { registerUser,userLogIn,getAllUser,getUser,updateUser,deleteUser, forgetPassword,verifyOtp,resetPassword } from "../controllers/user.js";
import { upload } from "../middleware/multer.js";
import { authorization } from "../middleware/authorization.js";
import { validateRegister } from "../middleware/validation.js";
import { loginSchema, registerSchema ,getAllUserSchema, updateUserSchema, resetPasswordSchema, forgetPasswordSchema} from "../schema/user.schema.js";

const router = express.Router()

router.post('/registerUser',upload.single("image"),validateRegister(registerSchema),registerUser)
router.post('/login',validateRegister(loginSchema),userLogIn)

router.get('/getAllUser',authorization,validateRegister(getAllUserSchema),getAllUser)
router.get('/getUser',authorization,getUser)

router.put('/updateUser',authorization,validateRegister(updateUserSchema),updateUser)

router.delete('/deleteUser',authorization,deleteUser)

router.post('/forgetPassword',validateRegister(forgetPasswordSchema),forgetPassword)
router.post('/verifyOtp',authorization,verifyOtp)
router.post('/resetPassword',validateRegister(resetPasswordSchema),resetPassword)

export default router 