import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  disease: { type: String },
  // ✅ Prescription field lazmi add karein taake 404 error na aaye
  prescriptions: [
    {
      symptoms: String,
      diagnosis: String,
      medicines: String,
      date: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

const Patient = mongoose.model("Patient", patientSchema);

// 🚨 YEH LINE MISSING HAI JIS KI WAJAH SE CRASH HO RAHA HAI
export default Patient;