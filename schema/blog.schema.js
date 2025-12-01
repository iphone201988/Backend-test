import Joi from "joi";

export const createBlogSchema = Joi.object({
    title: Joi.string().trim().min(3).max(100).required().messages({
        "string.base": "Title must be a text value",
        "string.empty": "Title cannot be empty",
        "string.min": "Title must be at least 3 characters long",
        "string.max": "Title must not exceed 100 characters",
        "any.required": "Title is required",
      }),
  
    description: Joi.string().trim().min(10).required().messages({
        "string.base": "Description must be a text value",
        "string.empty": "Description cannot be empty",
        "string.min": "Description must be at least 10 characters long",
        "any.required": "Description is required",
      }),
  });