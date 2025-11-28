import { User } from "../models/user.js";
import JWT, { decode } from "jsonwebtoken";
import bcrypt from "bcrypt";

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function registerUser(req, res) {
  const { name, email, password,age, role } = req.body;
  try {
    if (role != "USER" && role != "ADMIN") {
      return res.status(400).json({
        message: "Invalid Role",
      });
    }
    if (!name || !email || !password) {
      return res.status(400).send({
        message: "Name,Email and Password is required",
      });
    }

    if (typeof name != "string" && typeof password != "string") {
      return res.status(400).send({
        message: "Enter a string",
      });
    }

    if (isNaN(Number(age))) {
      return res.status(400).send({
        message: "enter age in number",
      });
    }

    if (validateEmail(email) == false) {
      return res.status(400).send({
        message: "Email is invalid",
      });
    }

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
        message: "user not found",
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
    const {name,minAge,maxAge} = req.query
    let filter ={}

    if (name) {
      filter.name = {
        $regex: `^${name}`,
        $options: "i", 
      };
    }

    if(minAge || maxAge){
      filter.age ={}
      if (minAge) filter.age.$gte = Number(minAge); 
      if (maxAge) filter.age.$lte = Number(maxAge);
    }

    let page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 10

    const skip = (page -1) * limit

    const totalUser = await User.countDocuments(filter)

    const user = await User.find(filter)
    .skip(skip)
    .limit(limit)

    const totalPages = Math.ceil(totalUser/ limit)

    return res.status(200).json({
      message: "All users Fetched",
      totalUser,
      totalPages,
      currentPage:page,
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
    const { name, email,age, targetUserId } = req.body;

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

    if (validateEmail(email) == false) {
      return res.status(400).send({
        message: "Email is invalid",
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
