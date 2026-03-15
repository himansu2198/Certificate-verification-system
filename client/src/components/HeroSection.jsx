import { Link } from "react-router-dom"
import { useEffect, useState, useRef } from "react"

// Count-up hook
function useCountUp(target, duration = 1400) {
  const [count, setCount] = useState(0)
  const frame = useRef(null)

  useEffect(() => {
    if (!target) return
    const end = Number(target)
    if (end === 0) { setCount(0); return }
    const startTime = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setCount(Math.round(end * eased))
      if (progress < 1) frame.current = requestAnimationFrame(tick)
    }

    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [target, duration])

  return count
}

function HeroSection() {
  const [certCount, setCertCount] = useState(null)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/certificates/count`)
        if (res.ok) {
          const data = await res.json()
          setCertCount(data.count)
        }
      } catch {
        // Silently fall back to static value
        setCertCount(100)
      }
    }
    fetchCount()
  }, [])

  const animatedCount = useCountUp(certCount)

  return (
    <section
      className="relative flex flex-col items-center overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #08060f 0%, #0d0b1e 40%, #110d2e 70%, #0a0818 100%)",
        paddingTop: "120px",   // clears the fixed navbar
        paddingBottom: "80px",
      }}
    >
      {/* ── Background effects ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Main spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2" style={{
          width: "900px", height: "600px",
          background: "radial-gradient(ellipse at 50% 0%, rgba(120,60,255,0.35) 0%, rgba(80,30,180,0.15) 40%, transparent 75%)",
        }} />
        {/* Secondary bloom */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2" style={{
          width: "600px", height: "400px",
          background: "radial-gradient(ellipse at 50% 10%, rgba(160,100,255,0.18) 0%, transparent 65%)",
        }} />
        {/* Left orb */}
        <div className="absolute top-1/3 -left-40" style={{
          width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(100,50,200,0.12) 0%, transparent 70%)",
          animation: "slowPulse 6s ease-in-out infinite",
        }} />
        {/* Right orb */}
        <div className="absolute top-1/2 -right-40" style={{
          width: "350px", height: "350px",
          background: "radial-gradient(circle, rgba(80,40,180,0.1) 0%, transparent 70%)",
          animation: "slowPulse 7s ease-in-out infinite",
          animationDelay: "1.5s",
        }} />
        {/* Dot grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.4,
        }} />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 text-center px-6 w-full max-w-4xl mx-auto flex flex-col items-center">

        {/* Badge — full padding so text is never clipped */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8 whitespace-nowrap"
          style={{
            background: "rgba(120,60,255,0.12)",
            border: "1px solid rgba(160,100,255,0.28)",
            backdropFilter: "blur(8px)",
            animation: "fadeUp 0.6s ease both",
          }}
        >
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
          <span className="text-sm font-medium" style={{ color: "#c4b5fd" }}>
            Trusted Certificate Verification Platform
          </span>
        </div>

        {/* Heading */}
        <h1
          className="font-extrabold text-white leading-tight tracking-tight mb-6"
          style={{ fontSize: "clamp(2.8rem, 7vw, 5rem)", animation: "fadeUp 0.8s ease 0.1s both" }}
        >
          Verify Certificates
          <span className="block" style={{
            backgroundImage: "linear-gradient(90deg, #a78bfa 0%, #818cf8 40%, #67e8f9 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Instantly & Securely
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-lg max-w-2xl mx-auto leading-relaxed mb-10"
          style={{ color: "rgba(203,213,225,0.7)", animation: "fadeUp 0.8s ease 0.2s both" }}>
          A powerful platform for organizations to issue, manage and verify internship
          certificates with confidence. Built for speed, security and simplicity.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
          style={{ animation: "fadeUp 0.8s ease 0.3s both" }}>
          <Link to="/search"
            className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-3.5 rounded-xl text-white transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 32px rgba(124,58,237,0.55), 0 8px 24px rgba(124,58,237,0.3)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Verify Certificate
          </Link>

          <Link to="/admin/login"
            className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-3.5 rounded-xl text-white transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(12px)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.borderColor = "rgba(167,139,250,0.35)" }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)" }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Admin Login
          </Link>
        </div>

        {/* Stats — dynamic cert count + static others */}
        <div className="flex flex-wrap justify-center gap-12 mb-16"
          style={{ animation: "fadeUp 0.8s ease 0.45s both" }}>

          {/* Dynamic — certificates count */}
          <div className="text-center">
            <p className="text-3xl font-bold text-white tabular-nums">
              {certCount === null ? (
                <span className="inline-block w-14 h-8 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.1)" }} />
              ) : (
                `${animatedCount}+`
              )}
            </p>
            <p className="text-sm mt-1" style={{ color: "rgba(148,163,184,0.65)" }}>Certificates Issued</p>
          </div>

          {/* Static */}
          <div className="text-center">
            <p className="text-3xl font-bold text-white">99.9%</p>
            <p className="text-sm mt-1" style={{ color: "rgba(148,163,184,0.65)" }}>Uptime</p>
          </div>

          {/* Static */}
          <div className="text-center">
            <p className="text-3xl font-bold text-white">256-bit</p>
            <p className="text-sm mt-1" style={{ color: "rgba(148,163,184,0.65)" }}>Secure & Encrypted</p>
          </div>
        </div>

        {/* ── Dashboard mockup ── */}
        <div
          className="w-full max-w-3xl mx-auto cursor-default"
          style={{
            animation: "fadeUp 1s ease 0.6s both",
          }}
        >
          {/* Floating + hover lift wrapper */}
          <div
            className="transition-all duration-500 hover:-translate-y-3"
            style={{
              animation: "float 5s ease-in-out infinite",
            }}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(167,139,250,0.2)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 40px 80px rgba(80,30,180,0.35), 0 20px 40px rgba(0,0,0,0.5)",
                transition: "box-shadow 0.5s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 0 1px rgba(167,139,250,0.2), 0 60px 100px rgba(120,50,220,0.45), 0 30px 60px rgba(0,0,0,0.6)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 0 1px rgba(255,255,255,0.05), 0 40px 80px rgba(80,30,180,0.35), 0 20px 40px rgba(0,0,0,0.5)"}
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3"
                style={{ background: "rgba(30,20,60,0.95)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
                </div>
                <div className="flex-1 h-6 rounded-md flex items-center px-3 mx-auto"
                  style={{ background: "rgba(255,255,255,0.05)", maxWidth: "280px" }}>
                  <span className="text-xs" style={{ color: "rgba(148,163,184,0.5)" }}>certiverify.app/dashboard</span>
                </div>
              </div>

              {/* Dashboard content */}
              <div style={{ background: "rgba(13,11,30,0.97)", padding: "20px" }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="font-bold text-white text-sm">Welcome back, Admin 👋</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(148,163,184,0.5)" }}>Here's what's happening today</p>
                  </div>
                  <div className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                    style={{ background: "linear-gradient(135deg,#7c3aed,#5b21b6)", color: "white" }}>
                    + New Upload
                  </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: "Certificates", value: certCount !== null ? `${certCount}` : "—", color: "#7c3aed", light: "rgba(124,58,237,0.12)" },
                    { label: "Students", value: certCount !== null ? `${certCount}` : "—", color: "#10b981", light: "rgba(16,185,129,0.1)" },
                    { label: "Admins", value: "2", color: "#818cf8", light: "rgba(129,140,248,0.12)" },
                  ].map(c => (
                    <div key={c.label} className="rounded-xl p-3" style={{ background: c.light, border: `1px solid ${c.color}22` }}>
                      <p className="text-xs mb-1" style={{ color: "rgba(148,163,184,0.6)" }}>{c.label}</p>
                      <p className="text-xl font-bold" style={{ color: c.color }}>{c.value}</p>
                    </div>
                  ))}
                </div>

                {/* Recent certificates table */}
                <div className="rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <p className="text-xs font-semibold text-white">Recent Certificates</p>
                    <p className="text-xs" style={{ color: "#a78bfa" }}>View all →</p>
                  </div>
                  <div>
                    {[
                      { id: "CERT117", name: "Priya Sharma", domain: "Full Stack" },
                      { id: "CERT116", name: "Arjun Mehta", domain: "Data Science" },
                      { id: "CERT115", name: "Sneha Verma", domain: "UI/UX Design" },
                    ].map((row, i) => (
                      <div key={row.id} className="flex items-center justify-between px-4 py-2.5"
                        style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        <span className="text-xs font-mono" style={{ color: "#818cf8" }}>{row.id}</span>
                        <span className="text-xs font-medium" style={{ color: "rgba(226,232,240,0.8)" }}>{row.name}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(124,58,237,0.15)", color: "#c4b5fd" }}>
                          {row.domain}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Glow beneath mockup */}
          <div className="h-16 -mt-4 blur-2xl opacity-30 mx-12"
            style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.5), transparent)" }} />
        </div>

      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 mt-6 flex flex-col items-center gap-1"
        style={{ color: "rgba(148,163,184,0.4)" }}>
        <span className="text-xs">Scroll to explore</span>
        <div className="w-5 h-8 rounded-full flex items-start justify-center p-1"
          style={{ border: "2px solid rgba(148,163,184,0.2)" }}>
          <div className="w-1 h-2 rounded-full bg-slate-500 animate-bounce" />
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slowPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  )
}

export default HeroSection