import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientPhone: { type: String, required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Optional agar kisi specific doctor ke liye ho
  doctorName: { type: String }, // For simplicity agar model link na karna ho
  date: { type: String, required: true }, // "2026-03-05"
  time: { type: String, required: true }, // "10:30 AM"
  status: { 
    type: String, 
    enum: ["Pending", "Confirmed", "Cancelled"], 
    default: "Pending" 
  },
  reason: { type: String }
}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);