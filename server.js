import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js"; // New
import appointmentRoutes from "./routes/appointmentRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ DB Error:", err.message));

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctor", doctorRoutes); // Register
app.use("/api/appointments", appointmentRoutes);
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));