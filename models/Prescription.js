import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  symptoms: { type: String, required: true },
  diagnosis: { type: String, required: true },
  medicines: [{
    name: String,
    dosage: String, // e.g., "1-0-1" or "After meal"
    duration: String
  }],
  advice: { type: String },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const Prescription = mongoose.model("Prescription", prescriptionSchema);
export default Prescription;