const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Secure Authentication",
    description: "JWT-based admin authentication with bcrypt password hashing. Only authorized admins can manage certificates.",
    accent: "rgba(139,92,246,0.8)",
    glow: "rgba(139,92,246,0.15)",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Excel Bulk Upload",
    description: "Upload hundreds of certificates at once via Excel files. Automatic validation, duplicate detection and error reporting.",
    accent: "rgba(16,185,129,0.8)",
    glow: "rgba(16,185,129,0.12)",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Instant Verification",
    description: "Students can verify their certificates in seconds by entering their unique Certificate ID. No account needed.",
    accent: "rgba(99,102,241,0.8)",
    glow: "rgba(99,102,241,0.15)",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    title: "PDF Download",
    description: "Students can download their verified certificate as a professional PDF document with one click.",
    accent: "rgba(168,85,247,0.8)",
    glow: "rgba(168,85,247,0.15)",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
    title: "MongoDB Storage",
    description: "All certificates are securely stored in MongoDB Atlas cloud database with high availability and reliability.",
    accent: "rgba(20,184,166,0.8)",
    glow: "rgba(20,184,166,0.12)",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Admin Dashboard",
    description: "Real-time stats, recent certificate activity and quick actions — all in one clean dashboard.",
    accent: "rgba(245,158,11,0.8)",
    glow: "rgba(245,158,11,0.12)",
  },
]

function FeaturesSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)" }}>

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]"
          style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)" }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ color: "#a78bfa", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
            Why CertiVerify
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-5 mb-4">
            Everything you need
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(148,163,184,0.8)" }}>
            A complete certificate management ecosystem built with modern technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl p-7 cursor-default transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                backdropFilter: "blur(10px)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)"
                e.currentTarget.style.border = `1px solid ${feature.accent.replace("0.8", "0.3")}`
                e.currentTarget.style.boxShadow = `0 20px 40px ${feature.glow}`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.03)"
                e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)"
                e.currentTarget.style.boxShadow = "none"
              }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                style={{ background: feature.glow, color: feature.accent, border: `1px solid ${feature.accent.replace("0.8", "0.2")}` }}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(148,163,184,0.75)" }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection