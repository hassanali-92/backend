import express from "express";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import DiagnosisLog from "../models/DiagnosisLog.js";
import { protect, authorize } from "../models/authMiddleware.js";

dotenv.config();
const router = express.Router();

const groq = new Groq({ 
    apiKey: process.env.GROQ_API_KEY 
});

// AI ko simple aur short summary dene ka order
const SYSTEM_PROMPT = `You are a Medical Assistant. Provide a very SHORT and CLEAR clinical summary. 
IMPORTANT: 
1. Do NOT use any asterisks (*) or bold marks (**) anywhere.
2. Provide ONLY one set of headings.
3. Suggest 2-3 essential medications with dose and frequency.
4. Keep the entire response under 100 words.

Structure your output EXACTLY like this:

DIAGNOSIS AND INSIGHTS
- Conditions: [2-3 names]
- Risk: [Low/Medium/High]
- Tests: [Main test name]

SUGGESTED MEDICATIONS
1. [Name] - [Dose] - [Freq]
2. [Name] - [Dose] - [Freq]

ADVICE
- [One short line of advice]`;

router.post("/analyze", protect, authorize("doctor"), async (req, res) => {
  try {
    const { patientId, symptoms, age, gender } = req.body;

    if (!symptoms) return res.status(400).json({ success: false, message: "Symptoms missing!" });

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Patient: ${age}yr ${gender}. Symptoms: ${symptoms}. Give short summary.` }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2, // Focus on facts
    });

    const aiResponse = completion.choices[0]?.message?.content || "No data.";

    // Save to DB
    let log = { aiResponse };
    if (patientId) {
        log = await DiagnosisLog.create({
            patientId,
            doctorId: req.user.id,
            symptoms,
            aiResponse,
            riskLevel: aiResponse.toLowerCase().includes("high") ? "High" : "Low"
        });
    }

    res.json({ success: true, data: log });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;