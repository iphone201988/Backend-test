import { User } from "../models/user.js";
import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";

const secret = "systummm";

export async function registerUser(req, res) {
  try {
    const { name, email, password, role } = req.body;
    if (role != "USER" && role != "ADMIN") {
      return res.status(400).json({
        message: "Invalid Role",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    const token = JWT.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      secret
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
      secret
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
