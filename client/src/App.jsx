import { Routes, Route, Navigate } from "react-router-dom"
import StudentSearch from "./pages/StudentSearch"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"
import UploadExcel from "./pages/UploadExcel"
import CertificateView from "./pages/CertificateView"
import HomePage from "./pages/HomePage"
import ProfilePage from "./pages/ProfilePage"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <Routes>
      {/* Public pages with Navbar */}
      <Route path="/" element={<><Navbar /><HomePage /></>} />
      <Route path="/search" element={<><Navbar /><StudentSearch /></>} />
      <Route path="/certificate/:id" element={<><Navbar /><CertificateView /></>} />

      {/* Auth page - no Navbar */}
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected pages - Sidebar is inside each page */}
      <Route path="/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/upload" element={<ProtectedRoute><UploadExcel /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
    </Routes>
  )
}

export default App