import { useState } from "react"
import { useNavigate } from "react-router-dom"

function StudentSearch() {
  const [certificateId, setCertificateId] = useState("")
  const [error, setError] = useState("")
  const [focused, setFocused] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    setError("")
    if (!certificateId.trim()) {
      setError("Please enter a Certificate ID")
      return
    }
    navigate(`/certificate/${certificateId.trim()}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden pt-20"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)" }}>

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }} />
        <div className="absolute top-20 left-10 w-80 h-80 rounded-full animate-pulse"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)", animationDuration: "4s" }} />
        <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full animate-pulse"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", animationDuration: "5s", animationDelay: "1s" }} />
        <div className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }} />
      </div>

      <div className="relative z-10 w-full max-w-lg" style={{ animation: "fadeSlideUp 0.6s ease forwards" }}>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              boxShadow: "0 20px 40px rgba(124,58,237,0.35)"
            }}>
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
            Verify Certificate
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(148,163,184,0.75)" }}>
            Enter your unique Certificate ID to instantly verify<br />the authenticity of your credential.
          </p>
        </div>

        {/* Glass Card */}
        <div className="rounded-2xl p-8 transition-all duration-300"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: focused ? "1px solid rgba(139,92,246,0.4)" : "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            boxShadow: focused ? "0 20px 60px rgba(139,92,246,0.15)" : "0 20px 60px rgba(0,0,0,0.3)",
          }}>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "rgba(196,181,253,0.9)" }}>
                Certificate ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4" style={{ color: focused ? "#a78bfa" : "rgba(100,116,139,0.8)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="e.g. CV2024001"
                  value={certificateId}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onChange={(e) => { setCertificateId(e.target.value); setError("") }}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white placeholder-slate-600 focus:outline-none transition-all duration-200 text-sm"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: focused ? "1px solid rgba(139,92,246,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    boxShadow: focused ? "0 0 0 3px rgba(139,92,246,0.1), inset 0 1px 2px rgba(0,0,0,0.2)" : "inset 0 1px 2px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl px-4 py-3"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <svg className="w-4 h-4 shrink-0" style={{ color: "#f87171" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm" style={{ color: "#f87171" }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full text-white font-bold py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-sm"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "linear-gradient(135deg, #6d28d9, #4338ca)"
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(124,58,237,0.4)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "linear-gradient(135deg, #7c3aed, #4f46e5)"
                e.currentTarget.style.boxShadow = "none"
              }}
            >
              Verify Certificate
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "rgba(100,116,139,0.7)" }}>
          Certificate IDs are provided by your organization.{" "}
          <span style={{ color: "rgba(148,163,184,0.6)" }}>Format: CV followed by year and number.</span>
        </p>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default StudentSearch