import mongoose from "mongoose";

const diagnosisLogSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  symptoms: { type: String, required: true },
  aiResponse: { type: String, required: true }, // Groq ka jawab yahan save hoga
  riskLevel: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("DiagnosisLog", diagnosisLogSchema);