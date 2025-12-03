import express from "express";
import { upload } from "../middleware/multer.js";
import { authorization } from "../middleware/authorization.js";
import { createAccessorie, getAccessorie } from "../controllers/accessorie.js";

const accessorieRouter = express.Router()

accessorieRouter.post('/createAccessorie',upload.array("images",5),authorization,createAccessorie)
accessorieRouter.get('/getAccessorie',authorization,getAccessorie)

export default accessorieRouter