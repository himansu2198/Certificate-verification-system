const express = require("express")
const router = express.Router()
const Certificate = require("../models/Certificate")
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const { verifyToken, adminOnly } = require("../middleware/authMiddleware")

// PROTECTED — GET /api/admin/stats
router.get("/stats", verifyToken, adminOnly, async (req, res) => {
  try {
    const [totalCertificates, totalAdmins, recentCertificates] = await Promise.all([
      Certificate.countDocuments(),
      User.countDocuments({ role: "admin" }),
      Certificate.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("certificateId studentName domain createdAt"),
    ])
    res.json({ totalCertificates, totalAdmins, recentCertificates })
  } catch (error) {
    console.error("Stats error:", error)
    res.status(500).json({ message: "Failed to fetch stats" })
  }
})

// PROTECTED — GET /api/admin/profile
router.get("/profile", verifyToken, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (!user) return res.status(404).json({ message: "User not found" })
    res.json(user)
  } catch (error) {
    console.error("Profile error:", error)
    res.status(500).json({ message: "Failed to fetch profile" })
  }
})

// PROTECTED — PUT /api/admin/update-profile
router.put("/update-profile", verifyToken, adminOnly, async (req, res) => {
  try {
    const { name, email } = req.body

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" })
    }

    // Check if email is taken by another user
    const existing = await User.findOne({ email, _id: { $ne: req.user.id } })
    if (existing) {
      return res.status(400).json({ message: "Email is already in use by another account" })
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password")

    res.json({ message: "Profile updated successfully", user })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({ message: "Failed to update profile" })
  }
})

// PROTECTED — PUT /api/admin/change-password
router.put("/change-password", verifyToken, adminOnly, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" })
    }

    const user = await User.findById(req.user.id).select("+password")
    if (!user) return res.status(404).json({ message: "User not found" })

    const isMatch = await user.matchPassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" })
    }

    user.password = newPassword
    await user.save() // triggers pre-save bcrypt hash

    res.json({ message: "Password changed successfully" })
  } catch (error) {
    console.error("Change password error:", error)
    res.status(500).json({ message: "Failed to change password" })
  }
})

module.exports = router