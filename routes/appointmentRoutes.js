import express from "express";
import Appointment from "../models/Appointment.js";
import { protect, authorize } from "../middleware/authMiddleware.js"; // Aapka existing auth

const router = express.Router();

// 1. PUBLIC: Patient appointment book kare ga (No login required)
router.post("/book", async (req, res) => {
  try {
    const newBooking = await Appointment.create(req.body);
    res.status(201).json({ success: true, data: newBooking });
  } catch (err) {
    res.status(500).json({ message: "Booking failed: " + err.message });
  }
});

// 2. PROTECTED: Saari appointments dekhne ke liye (Admin/Doctor)
router.get("/all", protect, async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json({ success: true, data: appointments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. PROTECTED: Status update karne ke liye (Confirm/Cancel)
router.put("/update/:id", protect, authorize("admin", "receptionist"), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );
    res.json({ success: true, data: appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;