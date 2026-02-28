// routes/patients.js mein ye add karein
router.post("/prescribe", protect, authorize("doctor"), async (req, res) => {
  try {
    const { patientId, diagnosis, symptoms, medicines } = req.body;
    
    const newRx = await Prescription.create({
      patientId,
      doctorId: req.user._id, // User ID middleware se ayegi
      symptoms,
      diagnosis,
      // Medicines ko array of object mein convert karna
      medicines: [{ name: medicines, dosage: "As mentioned", duration: "3 days" }]
    });

    res.status(201).json({ success: true, data: newRx });
  } catch (err) {
    res.status(500).json({ message: "Backend Error: " + err.message });
  }
});