import express from "express";
import User from "../models/User.js";

const router = express.Router();

// API: Naya Doctor add karne ke liye
router.post("/add-doctor", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const doctor = await User.create({
      name,
      email,
      password,
      role: "doctor"
    });

    res.status(201).json({ 
      message: "Doctor created successfully", 
      doctor: { id: doctor._id, name: doctor.name, email: doctor.email } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API: Admin Dashboard Stats
router.get("/stats", async (req, res) => {
  try {
    const doctorCount = await User.countDocuments({ role: "doctor" });
    const patientCount = await User.countDocuments({ role: "patient" });
    const staffCount = await User.countDocuments({ role: "receptionist" });

    res.json({
      doctors: doctorCount,
      patients: patientCount,
      staff: staffCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;