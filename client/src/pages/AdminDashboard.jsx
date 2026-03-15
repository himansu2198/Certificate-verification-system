import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import Sidebar from "../components/Sidebar"

const recentActivity = [
  { icon: "📤", message: "Excel file uploaded", time: "2 min ago", color: "bg-blue-50 text-blue-600" },
  { icon: "🔍", message: "Certificate verified — ID #CV2024001", time: "5 min ago", color: "bg-indigo-50 text-indigo-600" },
  { icon: "🔐", message: "Admin logged in", time: "12 min ago", color: "bg-purple-50 text-purple-600" },
  { icon: "✅", message: "Certificate generated", time: "1 hr ago", color: "bg-green-50 text-green-600" },
  { icon: "📤", message: "Bulk upload — 24 records added", time: "3 hr ago", color: "bg-blue-50 text-blue-600" },
]

const domainColors = {
  default: "bg-slate-100 text-slate-600",
  "Web Development": "bg-blue-50 text-blue-700",
  "Data Science": "bg-violet-50 text-violet-700",
  "UI/UX Design": "bg-pink-50 text-pink-700",
  "Machine Learning": "bg-amber-50 text-amber-700",
  "Cybersecurity": "bg-red-50 text-red-700",
  "Cloud Computing": "bg-sky-50 text-sky-700",
  "Full Stack Development": "bg-indigo-50 text-indigo-700",
}

function getDomainColor(domain) {
  return domainColors[domain] || domainColors.default
}

// Animated counter hook
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0)
  const frameRef = useRef(null)

  useEffect(() => {
    if (target === undefined || target === null) return
    const start = 0
    const end = Number(target)
    if (end === 0) { setCount(0); return }
    const startTime = performance.now()

    const animate = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(start + (end - start) * eased))
      if (progress < 1) frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration])

  return count
}

// Clean trailing numbers from name
function cleanName(name) {
  return name?.replace(/\s+\d+$/, "") || name
}

function StatCard({ card, loading, error }) {
  const animatedValue = useCountUp(loading || error ? 0 : card.value ?? 0)

  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-2xl hover:shadow-slate-200/70 hover:-translate-y-2 transition-all duration-300 group overflow-hidden relative cursor-default"
    >
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} rounded-t-2xl`} />
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
          <p className={`text-4xl font-bold ${card.textColor} mt-1 tabular-nums`}>
            {loading
              ? <span className="inline-block w-16 h-9 bg-slate-100 rounded-lg animate-pulse" />
              : error ? "—"
              : animatedValue}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
          {card.icon}
        </div>
      </div>
      <p className={`text-xs font-medium ${card.indicatorColor}`}>{card.indicator}</p>
    </div>
  )
}

function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("adminToken")
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("adminToken")
          navigate("/admin/login")
          return
        }
        const data = await res.json()
        if (!res.ok) { setError("Failed to load stats"); return }
        setStats(data)
      } catch { setError("Server error. Could not load stats.") }
      finally { setLoading(false) }
    }
    fetchStats()
  }, [navigate])

  const statCards = [
    {
      label: "Total Certificates",
      value: stats?.totalCertificates,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      gradient: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      indicator: "+12% this month",
      indicatorColor: "text-blue-400",
    },
    {
      label: "Total Students",
      value: stats?.totalCertificates,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      gradient: "from-emerald-500 to-green-600",
      textColor: "text-emerald-600",
      indicator: "Actively enrolled",
      indicatorColor: "text-emerald-400",
    },
    {
      label: "Active Admins",
      value: stats?.totalAdmins,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      gradient: "from-violet-500 to-purple-600",
      textColor: "text-violet-600",
      indicator: "Full access",
      indicatorColor: "text-violet-400",
    },
  ]

  const quickActions = [
    {
      to: "/upload",
      title: "Upload Certificates",
      desc: "Bulk import via Excel file",
      gradient: "from-blue-600 to-indigo-600",
      hoverShadow: "hover:shadow-blue-500/20",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      ),
    },
    {
      to: "/search",
      title: "Verify Certificate",
      desc: "Look up by Certificate ID",
      gradient: "from-emerald-500 to-teal-600",
      hoverShadow: "hover:shadow-emerald-500/20",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      to: "/upload",
      title: "Generate Certificate",
      desc: "Create a new certificate",
      gradient: "from-orange-500 to-amber-500",
      hoverShadow: "hover:shadow-orange-500/20",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
  ]

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 overflow-y-auto">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <Link to="/upload"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Upload
          </Link>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {statCards.map((card, i) => (
            <div key={card.label} style={{ animationDelay: `${i * 80}ms` }}>
              <StatCard card={card} loading={loading} error={error} />
            </div>
          ))}
        </div>

        {/* Two column layout */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">

          {/* Recent Certificates */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-800">Recent Certificates</h2>
                <p className="text-xs text-slate-400 mt-0.5">Latest 5 uploaded records</p>
              </div>
              <Link to="/upload" className="text-xs text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors duration-200">
                Upload more →
              </Link>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => <div key={i} className="h-12 bg-slate-50 rounded-xl animate-pulse" />)}
                </div>
              ) : error ? (
                <p className="text-slate-400 text-sm text-center py-6">Could not load certificates.</p>
              ) : !stats?.recentCertificates?.length ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-7 h-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-sm font-medium">No certificates yet</p>
                  <Link to="/upload" className="text-blue-600 text-sm font-semibold mt-2 inline-block hover:text-blue-700">
                    Upload your first batch →
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left">
                        <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">ID</th>
                        <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Student</th>
                        <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Domain</th>
                        <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentCertificates.map((cert) => (
                        <tr key={cert.certificateId} className="group border-t border-slate-50 hover:bg-blue-50/30 transition-colors duration-150">
                          <td className="py-3.5 pr-4">
                            <Link to={`/certificate/${cert.certificateId}`}
                              className="font-mono text-xs text-blue-600 hover:text-blue-800 hover:underline font-semibold bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors duration-150">
                              {cert.certificateId}
                            </Link>
                          </td>
                          {/* Clean trailing numbers from student name */}
                          <td className="py-3.5 pr-4 font-medium text-slate-800">{cleanName(cert.studentName)}</td>
                          <td className="py-3.5 pr-4">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getDomainColor(cert.domain)}`}>
                              {cert.domain}
                            </span>
                          </td>
                          <td className="py-3.5 text-slate-400 text-xs">
                            {new Date(cert.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">Recent Activity</h2>
              <p className="text-xs text-slate-400 mt-0.5">System events</p>
            </div>
            <div className="p-4 space-y-1">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors duration-150 cursor-default">
                  <div className={`w-8 h-8 rounded-xl ${activity.color} flex items-center justify-center text-sm shrink-0`}>
                    {activity.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-700 leading-snug">{activity.message}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.to}
                className={`group relative bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-2xl ${action.hoverShadow} hover:-translate-y-2 transition-all duration-300 overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300 rounded-2xl`} />
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  {action.icon}
                </div>
                <p className="font-bold text-slate-800 text-sm mb-1">{action.title}</p>
                <p className="text-xs text-slate-400">{action.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-blue-600 transition-colors duration-200">
                  Go now
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}

export default AdminDashboard