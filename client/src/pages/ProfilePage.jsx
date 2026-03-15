import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"

function ProfilePage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("info")

  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editLoading, setEditLoading] = useState(false)
  const [editMsg, setEditMsg] = useState(null)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwdMsg, setPwdMsg] = useState(null)

  const token = localStorage.getItem("adminToken")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("adminToken")
          navigate("/admin/login")
          return
        }
        const data = await res.json()
        setProfile(data)
        setEditName(data.name)
        setEditEmail(data.email)
      } catch { }
      finally { setLoading(false) }
    }
    fetchProfile()
  }, [navigate, token])

  const getInitials = (name) => {
    if (!name) return "A"
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
  }

  // Avatar gradient based on initials
  const getAvatarGradient = (name) => {
    const gradients = [
      "from-blue-500 to-indigo-600",
      "from-emerald-500 to-teal-600",
      "from-violet-500 to-purple-600",
      "from-orange-500 to-amber-500",
      "from-pink-500 to-rose-600",
    ]
    if (!name) return gradients[0]
    const idx = name.charCodeAt(0) % gradients.length
    return gradients[idx]
  }

  const handleEditProfile = async (e) => {
    e.preventDefault()
    setEditMsg(null)
    setEditLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editName, email: editEmail }),
      })
      const data = await res.json()
      if (!res.ok) { setEditMsg({ type: "error", text: data.message }); return }
      setProfile(prev => ({ ...prev, name: editName, email: editEmail }))
      setEditMsg({ type: "success", text: "Profile updated successfully!" })
    } catch {
      setEditMsg({ type: "error", text: "Server error. Try again." })
    } finally { setEditLoading(false) }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPwdMsg(null)
    if (newPassword !== confirmPassword) {
      setPwdMsg({ type: "error", text: "New passwords do not match" })
      return
    }
    setPwdLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      })
      const data = await res.json()
      if (!res.ok) { setPwdMsg({ type: "error", text: data.message }); return }
      setPwdMsg({ type: "success", text: "Password changed successfully!" })
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("")
    } catch {
      setPwdMsg({ type: "error", text: "Server error. Try again." })
    } finally { setPwdLoading(false) }
  }

  const tabs = [
    { id: "info", label: "Profile Info", icon: "👤" },
    { id: "edit", label: "Edit Profile", icon: "✏️" },
    { id: "password", label: "Change Password", icon: "🔐" },
  ]

  const inputClass = "w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage your admin account details</p>
        </div>

        <div className="max-w-3xl">

          {/* Avatar Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getAvatarGradient(profile?.name)} flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0 transition-transform duration-300 hover:scale-105`}
              style={{ boxShadow: "0 8px 24px rgba(59,130,246,0.3)" }}>
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : getInitials(profile?.name)}
            </div>
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-slate-100 rounded-lg animate-pulse" />
                  <div className="h-4 w-64 bg-slate-100 rounded-lg animate-pulse" />
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-slate-900">{profile?.name}</h2>
                  <p className="text-slate-400 text-sm mt-0.5">{profile?.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      {profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1)}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Active
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setEditMsg(null); setPwdMsg(null) }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-250 flex items-center justify-center gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-white text-slate-900 shadow-sm scale-[1.02]"
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content with fade transition */}
          <div style={{ animation: "tabFadeIn 0.2s ease forwards" }} key={activeTab}>

            {/* Profile Info */}
            {activeTab === "info" && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 mb-5">Profile Information</h3>
                {loading ? (
                  <div className="space-y-4">
                    {[1,2,3,4].map(i => <div key={i} className="h-14 bg-slate-50 rounded-xl animate-pulse" />)}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[
                      { label: "Full Name", value: profile?.name, icon: "👤", bg: "bg-blue-50" },
                      { label: "Email Address", value: profile?.email, icon: "✉️", bg: "bg-indigo-50" },
                      { label: "Role", value: profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1), icon: "🔐", bg: "bg-purple-50" },
                      { label: "Member Since", value: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—", icon: "📅", bg: "bg-emerald-50" },
                    ].map((field) => (
                      <div key={field.label} className={`flex items-center gap-4 p-4 ${field.bg} rounded-xl hover:brightness-95 transition-all duration-150`}>
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lg shadow-sm shrink-0">
                          {field.icon}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{field.label}</p>
                          <p className="text-sm font-semibold text-slate-800 mt-0.5">{field.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setActiveTab("edit")}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 hover:-translate-y-0.5 active:translate-y-0">
                    Edit Profile
                  </button>
                  <button onClick={() => setActiveTab("password")}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0">
                    Change Password
                  </button>
                </div>
              </div>
            )}

            {/* Edit Profile */}
            {activeTab === "edit" && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 mb-5">Edit Profile</h3>
                <form onSubmit={handleEditProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                    <input type="text" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Your full name" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                    <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="admin@example.com" className={inputClass} />
                  </div>
                  {editMsg && (
                    <div className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${editMsg.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}
                      style={{ animation: "tabFadeIn 0.2s ease" }}>
                      {editMsg.text}
                    </div>
                  )}
                  <button type="submit" disabled={editLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:transform-none">
                    {editLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </span>
                    ) : "Save Changes"}
                  </button>
                </form>
              </div>
            )}

            {/* Change Password */}
            {activeTab === "password" && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 mb-5">Change Password</h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Current Password</label>
                    <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Enter current password" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">New Password</label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min 6 characters" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat new password" className={inputClass} />
                  </div>
                  {pwdMsg && (
                    <div className={`px-4 py-3 rounded-xl text-sm font-medium ${pwdMsg.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}
                      style={{ animation: "tabFadeIn 0.2s ease" }}>
                      {pwdMsg.text}
                    </div>
                  )}
                  <button type="submit" disabled={pwdLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:transform-none">
                    {pwdLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Updating...
                      </span>
                    ) : "Update Password"}
                  </button>
                </form>
              </div>
            )}
          </div>

        </div>
      </main>

      <style>{`
        @keyframes tabFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default ProfilePage