import { Blog } from "../models/blog.js";

export async function createBlog(req, res) {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    let uploads = [];
    if (req.files && req.files.length > 0) {
      uploads = req.files.map((file) => `image/${file.filename}`);
    }
console.log(uploads)
    const blog = await Blog.create({
      title,
      description,
      uploads,
      userId,
    });
    return res.status(200).json({
      message: "Blog created Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}

export async function getBlog(req, res) {
  try {
    const userId = req.user.id;
    const blog = await Blog.find({ userId });
    return res.status(200).json({
      message: "All Blogs",
      blog,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}

export async function getAllBlogs(req, res) {
  try {
    console.log("hii")
    const role = req.user.role;
    if (role != "ADMIN") {
      return res.status(400).json({
        message: "not accessable",
      });
    }
    console.log("hii")
    const blog = await Blog.find().populate("userId", "name email");
    // console.log("blog")
    return res.status(200).json({
      message: "All Blogs",
      blog,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}

export async function editBlogs(req,res) {
  
}