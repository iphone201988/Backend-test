import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must be at most 30 characters",
    "any.required": "Name is required",
  }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(2).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 2 characters",
    "any.required": "Password is required",
  }),

  age: Joi.number().integer().required().messages({
    "number.base": "Age must be a number",
    "any.required": "Age is required",
  }),

  role: Joi.string().valid("USER", "ADMIN").required().messages({
    "any.only": "Role must be USER or ADMIN",
    "any.required": "Role is required",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(2).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 2 characters",
    "any.required": "Password is required",
  }),
});

export const getAllUserSchema = Joi.object({
  name: Joi.string().optional().messages({
    "string.base": "Name must be a string",
  }),

  minAge: Joi.number().integer().min(0).optional().messages({
    "number.base": "minAge must be a number",
    "number.min": "minAge cannot be negative",
  }),

  maxAge: Joi.number().integer().min(0).optional().messages({
    "number.base": "maxAge must be a number",
    "number.min": "maxAge cannot be negative",
  }),

  page: Joi.number().integer().min(1).optional().messages({
    "number.base": "page must be a number",
    "number.min": "page must be at least 1",
  }),

  limit: Joi.number().integer().min(1).max(100).optional().messages({
    "number.base": "limit must be a number",
    "number.min": "limit must be at least 1",
    "number.max": "limit cannot be more than 100",
  }),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).optional().messages({
    "string.base": "Name must be a string",
    "string.min": "Name must be at least 3 characters",
  }),

  email: Joi.string().email().optional().messages({
    "string.email": "Please enter a valid email",
  }),

  age: Joi.number().integer().min(0).optional().messages({
    "number.base": "Age must be a number",
  }),

  targetUserId: Joi.string().hex().length(24).optional().messages({
    "string.hex": "Invalid user id",
    "string.length": "Invalid user id",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required to update",
  });

export const forgetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),
});

export const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email address",
        "any.required": "Email is required",
      }),
      newPassword: Joi.string().min(2).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 2 characters",
        "any.required": "Password is required",
      })
    })
