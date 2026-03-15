import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ background: "#0a0e1a" }}>

      {/* Top divider with gradient */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.5), rgba(99,102,241,0.5), transparent)" }} />

      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-32 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 70%)" }} />

      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <div className="grid md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <span className="text-white text-xl font-bold">CertiVerify</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "rgba(148,163,184,0.7)" }}>
              A modern certificate verification platform helping organizations issue and validate credentials with ease.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              {[
                { label: "G", title: "GitHub" },
                { label: "T", title: "Twitter" },
                { label: "L", title: "LinkedIn" },
              ].map((social) => (
                <a key={social.label} href="#" title={social.title}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(79,70,229,0.4))"
                    e.currentTarget.style.borderColor = "rgba(139,92,246,0.4)"
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(124,58,237,0.2)"
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)"
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"
                    e.currentTarget.style.boxShadow = "none"
                  }}>
                  <span className="text-xs font-bold" style={{ color: "rgba(148,163,184,0.8)" }}>{social.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Features</h4>
            <ul className="space-y-3 text-sm">
              {["Verify Certificate", "Excel Upload", "PDF Download", "Admin Dashboard"].map((item) => (
                <li key={item}>
                  <Link to="/"
                    className="transition-colors duration-200 hover:text-violet-400"
                    style={{ color: "rgba(148,163,184,0.7)" }}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2" style={{ color: "rgba(148,163,184,0.7)" }}>
                <svg className="w-4 h-4 shrink-0" style={{ color: "#a78bfa" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                support@certiverify.com
              </li>
              <li className="flex items-center gap-2" style={{ color: "rgba(148,163,184,0.7)" }}>
                <svg className="w-4 h-4 shrink-0" style={{ color: "#a78bfa" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)", color: "rgba(100,116,139,0.8)" }}>
          <p>© {new Date().getFullYear()} CertiVerify. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service"].map(link => (
              <a key={link} href="#"
                className="transition-colors duration-200 hover:text-violet-400">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer