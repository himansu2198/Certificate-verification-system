const express = require("express")
const router = express.Router()
const multer = require("multer")
const Certificate = require("../models/Certificate")
const { verifyToken, adminOnly } = require("../middleware/authMiddleware")
const { uploadCertificates } = require("../controllers/certificateController")

// Multer — store file in memory (no disk writes needed)
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ]
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("Only .xlsx and .xls files are allowed"), false)
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
})

// PUBLIC — GET total certificate count (for homepage stats)
router.get("/count", async (req, res) => {
  try {
    const count = await Certificate.countDocuments()
    res.json({ count })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// PUBLIC — GET certificate by ID
// NOTE: /count must be defined BEFORE /:id — otherwise "count" is treated as an ID
router.get("/:id", async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      certificateId: req.params.id,
    })

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" })
    }

    res.json(certificate)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// PROTECTED — Upload Excel (admin only)
router.post(
  "/upload",
  verifyToken,
  adminOnly,
  upload.single("file"),
  uploadCertificates
)

// PROTECTED — Delete certificate (admin only)
router.delete("/:id", verifyToken, adminOnly, async (req, res) => {
  try {
    await Certificate.findOneAndDelete({ certificateId: req.params.id })
    res.json({ message: "Certificate deleted" })
  } catch (error) {
    res.status(500).json({ message: "Delete failed" })
  }
})

module.exports = router