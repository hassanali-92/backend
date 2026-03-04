import express from "express";
import Patient from "../models/Patient.js";
import { protect, authorize } from "../models/authMiddleware.js";

const router = express.Router();

// 1. GET ALL PATIENTS
router.get("/all", protect, async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: patients });
  } catch (err) {
    res.status(500).json({ message: "System Error: Unable to retrieve patient records." });
  }
});

// 2. GET SINGLE PATIENT (For Edit/History)
router.get("/:id", protect, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Clinical Error: Record not found." });
    res.status(200).json({ success: true, data: patient });
  } catch (err) {
    res.status(500).json({ message: "System Error: " + err.message });
  }
});

// 3. ADD PATIENT
router.post("/add", protect, authorize("admin", "doctor", "receptionist"), async (req, res) => {
  try {
    const { name, age, gender, phone, disease } = req.body; 
    const newPatient = await Patient.create({ name, age, gender, phone, disease });
    res.status(201).json({ success: true, data: newPatient });
  } catch (err) {
    res.status(400).json({ message: "Registration Failed: Verify patient details." });
  }
});

// 4. UPDATE PATIENT (EDIT)
router.put("/update/:id", protect, authorize("admin", "doctor"), async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedPatient) return res.status(404).json({ message: "Update Error: Patient not found." });
    res.status(200).json({ success: true, data: updatedPatient });
  } catch (err) {
    res.status(500).json({ message: "Clinical System Error: Update failed." });
  }
});

// 5. DELETE PATIENT (ADMIN ONLY)
router.delete("/delete/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ message: "Delete Error: Record does not exist." });
    res.status(200).json({ success: true, message: "Patient record purged successfully." });
  } catch (err) {
    res.status(500).json({ message: "Authorization Error: Deletion failed." });
  }
});

// 6. SAVE PRESCRIPTION
router.post("/prescribe", protect, authorize("doctor"), async (req, res) => {
  try {
    const { patientId, diagnosis, symptoms, medicines } = req.body;
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: "Clinical Error: Patient not found." });

    patient.prescriptions = patient.prescriptions || [];
    patient.prescriptions.push({ diagnosis, symptoms, medicines, date: new Date() });

    await patient.save();
    res.status(200).json({ success: true, message: "Clinical prescription saved successfully." });
  } catch (err) {
    res.status(500).json({ message: "Prescription Error: " + err.message });
  }
});

export default router;