import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Token banane ka helper function
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role }, 
    process.env.JWT_ACCESS_SECRET, 
    { expiresIn: "1d" }
  );
};

// 1. REGISTER USER
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check agar user pehle se hai
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Naya user create karein
    const user = await User.create({
      name,
      email,
      password,
      role: role || "patient" // Default role patient hoga
    });

    // Register hote hi Token generate karein
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. LOGIN USER
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        success: true,
        token: generateToken(user._id, user.role),
        user: { id: user._id, name: user.name, role: user.role }
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};