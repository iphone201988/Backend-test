import express from "express";
import { authorization } from "../middleware/authorization.js";
import { createBlog,getBlog,getAllBlogs } from "../controllers/blog.js";
import { upload } from "../middleware/multer.js";
import { createBlogSchema } from "../schema/blog.schema.js";
import { validateRegister } from "../middleware/validation.js";

const blogRouter = express.Router()

blogRouter.post('/createBlog',upload.array("images",5),authorization,validateRegister(createBlogSchema),createBlog)

blogRouter.get('/getBlog',authorization,getBlog)
blogRouter.get('/getAllBlogs',authorization,getAllBlogs)

export default blogRouter