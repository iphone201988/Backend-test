import { User } from "../models/user.js";
import JWT, { decode } from "jsonwebtoken";
import bcrypt from "bcrypt";
// import { registerSchema } from "../middleware/validation.js";
import { sendEmail } from "../utils/sendmail.js";

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function registerUser(req, res) {
  const { name, email, password, age, role } = req.body;
  try {
    let publicProfile = null;
    if (req.file) {
      publicProfile = `image/${req.file.filename}`;
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      age,
      role,
      publicProfile,
    });
    const token = JWT.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET
    );
    return res.status(200).json({
      message: "User Register",
      token,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}

export async function userLogIn(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }
    const token = JWT.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET
    );
    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}

export async function getAllUser(req, res) {
  try {
    const role = req.user.role;
    if (role != "ADMIN") {
      return res.status(400).json({
        message: "you are not a admin",
      });
    }
    const { name, minAge, maxAge } = req.query;
    let filter = {};

    if (name) {
      filter.name = {
        $regex: `^${name}`,
        $options: "i",
      };
    }

    if (minAge || maxAge) {
      filter.age = {};
      if (minAge) filter.age.$gte = Number(minAge);
      if (maxAge) filter.age.$lte = Number(maxAge);
    }

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const totalUser = await User.countDocuments(filter);

    const user = await User.find(filter).skip(skip).limit(limit);

    const totalPages = Math.ceil(totalUser / limit);

    return res.status(200).json({
      message: "All users Fetched",
      totalUser,
      totalPages,
      currentPage: page,
      limit,
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Invalid",
      error: error.message,
    });
  }
}

export async function getUser(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "U r not registered",
      });
    }
    return res.status(200).json({
      message: "Welcome",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Invalid",
      error: error.message,
    });
  }
}

export async function updateUser(req, res) {
  try {
    const { name, email, age, targetUserId } = req.body;

    const userId = req.user.id;
    const userRole = req.user.role;
    let userToUpdate;

    if (userRole === "ADMIN" && targetUserId) {
      userToUpdate = targetUserId;
    } else {
      userToUpdate = userId;
    }

    if (!name || !email) {
      return res.status(400).send({
        message: "Name and Email is required",
      });
    }

    const user = await User.findById(userToUpdate);
    if (!user) {
      return res.status(400).json({
        message: "U r not registered",
      });
    }

    if (name) {
      user.name = name;
    }

    if (email) {
      user.email = email;
    }

    if (age) {
      user.age = age;
    }

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({
      message: "Updated",
      user: userObj,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Invalid",
      error: error.message,
    });
  }
}

export async function deleteUser(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findByIdAndDelete(userId);
    return res.status(200).json({
      message: "user Deleted",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: "invalid user",
      error: error.message,
    });
  }
}

export async function forgetPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Account is not existed",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 90000).toString();
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const message = `Your password reset OTP is: ${otp}\nThis OTP is valid for 15 minutes.`;
    await sendEmail({
      to: user.email,
      subject: "Password Reset OTP",
      text: message,
    });

    return res.status(200).json({
      message: "If this email is registered, an OTP has been sent",
    });
  } catch (error) {
    console.error("forgotPassword error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function verifyOtp(req, res) {
  try {
    const { email,otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    const user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.resetPasswordOtpExpires < Date.now()) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    if (user.resetPasswordOtp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;
    user.otpVerify = true;
    await user.save();

    return res.status(200).json({
      message: "OTP verified",
      otpVerify:user.otpVerify
    });
  } catch (error) {
    console.error("resetPassword error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function resetPassword(req, res) {
  try {
    // console.log("dd")
    const { email, newPassword } = req.body;
    // console.log(email)
    const user = await User.findOne({ email });
    // console.log(user)
    if (!user) {
      return res.status(400).json({
        message: "Invalid request",
      });
    }
    console.log(user.otpVerify)
    if (!user.otpVerify) {
      return res.status(400).json({
        message: "verify first",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 8);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("resetPassword error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
