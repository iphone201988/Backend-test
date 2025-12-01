import { Blog } from "../models/blog.js";

export async function createBlog(req,res) {
    try{const {title,description} = req.body
    const userId = req.user.id

    let uploads = [];
    if (req.files && req.files.length > 0) {
        uploads = req.files.map((file) => `image/${file.filename}`);
      }
      
    const blog = await Blog.create({
        title,
        description,
        uploads,
        userId
    })
    return res.status(200).json({
        message:"Blog created Successfully"
    })
}catch(error){
    return res.status(400).json({
      error: error.message,
    });
  }
}