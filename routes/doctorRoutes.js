import express from "express";
import Prescription from "../models/Prescription.js";
import Patient from "../models/Patient.js";
import { protect, authorize } from "../models/authMiddleware.js";

const router = express.Router();

// 1. Prescription Likhen (Sirf Doctor)
router.post("/add-prescription", protect, authorize("doctor", "admin"), async (req, res) => {
  try {
    const { patientId, symptoms, diagnosis, medicines, advice } = req.body;

    const prescription = await Prescription.create({
      patientId,
      doctorId: req.user.id, // Login hue doctor ki ID khud hi utha lega
      symptoms,
      diagnosis,
      medicines,
      advice
    });

    res.status(201).json({ success: true, message: "Prescription added", data: prescription });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Kisi khas Patient ki History dekhna
router.get("/patient-history/:id", protect, authorize("doctor", "admin"), async (req, res) => {
  try {
    const history = await Prescription.find({ patientId: req.params.id }).populate("doctorId", "name");
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;