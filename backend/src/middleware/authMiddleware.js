import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; //adding the authenticated user's information to the Express request object.

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);

    return res.status(401).json({
      message: "Unauthorized - Invalid or expired token",
    });
  }
};
