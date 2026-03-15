import HeroSection from "../components/HeroSection"
import FeaturesSection from "../components/FeaturesSection"
import Footer from "../components/Footer"
import { Link } from "react-router-dom"

function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />

      {/* CTA Section */}
      <section className="py-24 px-6 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)" }}>

        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px]"
            style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)" }} />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Ready to get started?</h2>
          <p className="text-lg mb-10" style={{ color: "rgba(196,181,253,0.8)" }}>
            Start verifying certificates instantly or log in to manage your organization's credentials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/search"
              className="font-semibold px-8 py-4 rounded-xl text-white transition-all duration-200 hover:-translate-y-1"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 20px 40px rgba(124,58,237,0.4)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
              Verify a Certificate
            </Link>
            <Link to="/admin/login"
              className="font-semibold px-8 py-4 rounded-xl text-white transition-all duration-200 hover:-translate-y-1 hover:bg-white/15"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(12px)",
              }}>
              Admin Portal
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HomePage