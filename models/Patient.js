import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  disease: { type: String, default: "None" }
}, { timestamps: true });

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;