const express = require("express")
const cors = require("cors")
require("dotenv").config()

// DB Connection
const connectDB = require("./config/db")

// Routes
const certificateRoutes = require("./routes/certificateRoutes")
const authRoutes = require("./routes/authRoutes")
const adminRoutes = require("./routes/adminRoutes")

// Initialize App
const app = express()

// Connect Database
connectDB()

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/certificates", certificateRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)

// Test Route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀")
})

// Start Server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})