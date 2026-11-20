import { generateToken } from "../lib/utils.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import validator from "validator";

export const signup = async (req, res) => {

  const { fullName, email, password } = req.body;

  try {

    // Check required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Please provide a valid email address",
      });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be at least 6 character" });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (user) return res.status(400).json({ message: "Email already exists" });

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    if (newUser) {
      //generate jwt token
      generateToken(newUser._id, res); //from utils.js
      await newUser.save();

      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" }); //500 is a server error
  }
};

export const login = (req, res) => {
  res.send("login route");
};

export const logout = (req, res) => {
  res.send("logout route");
};
