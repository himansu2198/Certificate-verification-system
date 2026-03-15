import { useParams } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { QRCodeSVG } from "qrcode.react"

function CertificateView() {
  const { id } = useParams()
  const [certificate, setCertificate] = useState(null)
  const [error, setError] = useState("")
  const [pdfLoading, setPdfLoading] = useState(false)
  const certificateRef = useRef(null)

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/certificates/${id}`
        )
        setCertificate(response.data)
      } catch (err) {
        setError("Certificate not found")
      }
    }
    fetchCertificate()
  }, [id])

  const cleanName = (name) => name?.replace(/\s+\d+$/, "") || ""

  const formatDate = (date) => {
    if (!date) return ""
    const d = new Date(date)
    if (isNaN(d.getTime())) return ""
    const day   = String(d.getUTCDate()).padStart(2, "0")
    const month = String(d.getUTCMonth() + 1).padStart(2, "0")
    const year  = d.getUTCFullYear()
    return `${day}-${month}-${year}`
  }

  const verifyUrl = `${window.location.origin}/certificate/${id}`

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return
    setPdfLoading(true)

    try {
      const element = certificateRef.current
      window.scrollTo(0, 0)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        onclone: (clonedDoc) => {
          // Strip Tailwind CSS variables
          clonedDoc.querySelectorAll("*").forEach((el) => {
            ;[
              "--tw-ring-color", "--tw-shadow-color", "--tw-border-opacity",
              "--tw-bg-opacity", "--tw-text-opacity", "--tw-ring-shadow",
              "--tw-shadow", "--tw-ring-offset-shadow", "--tw-drop-shadow",
            ].forEach(v => el.style.removeProperty(v))
          })

          // Fix certificate container
          const cert = clonedDoc.querySelector("[data-cert]")
          if (cert) {
            cert.style.backgroundColor = "#ffffff"
            cert.style.background = "#ffffff"
            cert.style.boxShadow = "none"
            cert.style.overflow = "visible"
          }

          // Fix signature
          const sig = clonedDoc.querySelector("[data-signature]")
          if (sig) {
            sig.style.overflow = "visible"
            sig.style.minWidth = "210px"
            const cursive = sig.querySelector("[data-cursive]")
            if (cursive) {
              cursive.style.color = "#1e3a8a"
              cursive.style.overflow = "visible"
              cursive.style.whiteSpace = "nowrap"
              cursive.style.lineHeight = "1.4"
              cursive.style.paddingBottom = "4px"
            }
          }

          // Fix QR
          const qrWrap = clonedDoc.querySelector("[data-qr]")
          if (qrWrap) {
            qrWrap.style.overflow = "visible"
            const inner = qrWrap.querySelector("div")
            if (inner) {
              inner.style.background = "#ffffff"
              inner.style.backgroundColor = "#ffffff"
            }
          }

          // ── KEY FIX: Hide the date pill in the clone ──
          // We will draw the date text manually on the canvas after capture
          const datePill = clonedDoc.querySelector("[data-date-pill]")
          if (datePill) {
            datePill.style.visibility = "hidden"
          }
        },
      })

      // ── Draw date text manually on the canvas ──
      // This completely bypasses html2canvas color rendering issues
      const datePillEl = element.querySelector("[data-date-pill]")
      if (datePillEl && certificate) {
        const start = formatDate(certificate.startDate)
        const end   = formatDate(certificate.endDate)
        const dateText = `${start}   —   ${end}`

        const rect      = datePillEl.getBoundingClientRect()
        const certRect  = element.getBoundingClientRect()

        // Position relative to certificate element, scaled by canvas scale (2)
        const scale = 2
        const x = (rect.left - certRect.left) * scale
        const y = (rect.top  - certRect.top)  * scale
        const w = rect.width  * scale
        const h = rect.height * scale

        const ctx = canvas.getContext("2d")

        // Draw pill background
        ctx.fillStyle = "#eff6ff"
        ctx.strokeStyle = "#93c5fd"
        ctx.lineWidth = 2
        const r = 8 * scale
        ctx.beginPath()
        ctx.moveTo(x + r, y)
        ctx.lineTo(x + w - r, y)
        ctx.quadraticCurveTo(x + w, y, x + w, y + r)
        ctx.lineTo(x + w, y + h - r)
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
        ctx.lineTo(x + r, y + h)
        ctx.quadraticCurveTo(x, y + h, x, y + h - r)
        ctx.lineTo(x, y + r)
        ctx.quadraticCurveTo(x, y, x + r, y)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        // Draw date text
        ctx.fillStyle = "#1e3a8a"
        ctx.font = `bold ${15 * scale}px Arial, sans-serif`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(dateText, x + w / 2, y + h / 2)
      }

      // Generate PDF
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
      const A4_W = 297
      const A4_H = 210
      const margin = 8
      const maxW = A4_W - margin * 2
      const maxH = A4_H - margin * 2
      const ratio = Math.min(maxW / canvas.width, maxH / canvas.height)
      const scaledW = canvas.width  * ratio
      const scaledH = canvas.height * ratio
      const xOffset = (A4_W - scaledW) / 2
      const yOffset = (A4_H - scaledH) / 2
      pdf.addImage(imgData, "PNG", xOffset, yOffset, scaledW, scaledH)
      pdf.save(`${certificate.certificateId}.pdf`)

    } catch (err) {
      console.error("PDF generation failed:", err)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setPdfLoading(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Certificate Not Found</h1>
          <p className="text-slate-500">The certificate ID you entered does not exist.</p>
        </div>
      </div>
    )
  }

  if (!certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading certificate...</p>
        </div>
      </div>
    )
  }

  const startFormatted = formatDate(certificate.startDate)
  const endFormatted   = formatDate(certificate.endDate)

  return (
    <div
      data-page-wrapper
      className="min-h-screen flex flex-col items-center justify-center p-8 gap-6 pt-24"
      style={{ background: "linear-gradient(135deg, #f1f5f9, #dbeafe)" }}
    >
      <div
        ref={certificateRef}
        data-cert
        id="certificate"
        style={{
          backgroundColor: "#ffffff",
          width: "100%",
          maxWidth: "900px",
          position: "relative",
          border: "12px solid #1e40af",
          borderRadius: "4px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.15), inset 0 0 0 3px #93c5fd",
          fontFamily: "Georgia, 'Times New Roman', serif",
          overflow: "visible",
        }}
      >
        {/* Inner border */}
        <div style={{
          position: "absolute", inset: "6px",
          border: "2px solid #bfdbfe", borderRadius: "2px",
          pointerEvents: "none", zIndex: 1,
        }} />

        {/* Corner ornaments */}
        {[
          { pos: { top: "8px",    left:  "8px"  }, d: "M2 14 L2 2 L14 2"     },
          { pos: { top: "8px",    right: "8px"  }, d: "M14 2 L26 2 L26 14"   },
          { pos: { bottom: "8px", left:  "8px"  }, d: "M2 14 L2 26 L14 26"   },
          { pos: { bottom: "8px", right: "8px"  }, d: "M14 26 L26 26 L26 14" },
        ].map((corner, i) => (
          <div key={i} style={{ position: "absolute", ...corner.pos, zIndex: 2 }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d={corner.d} stroke="#1e40af" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        ))}

        {/* Watermark */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%) rotate(-30deg)",
          fontSize: "72px", fontWeight: "900", color: "#1e40af", opacity: 0.04,
          whiteSpace: "nowrap", letterSpacing: "8px",
          pointerEvents: "none", zIndex: 0, userSelect: "none",
        }}>
          HITSET TECHNOLOGIES
        </div>

        <div style={{ position: "relative", zIndex: 3, padding: "40px 56px" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "28px", borderBottom: "2px solid #dbeafe", paddingBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "8px" }}>
              <div style={{
                width: "44px", height: "44px",
                background: "linear-gradient(135deg, #1e40af, #3b82f6)",
                borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: "22px", fontWeight: "800", color: "#1e3a8a", letterSpacing: "2px", fontFamily: "Georgia, serif", margin: 0 }}>
                  HITSET TECHNOLOGIES
                </p>
                <p style={{ fontSize: "11px", color: "#64748b", letterSpacing: "4px", textTransform: "uppercase", margin: 0 }}>
                  Excellence in Technology Education
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
              <div style={{ height: "1px", width: "60px", background: "#93c5fd" }} />
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#1e40af" }} />
              <p style={{ fontSize: "18px", fontWeight: "700", color: "#1e40af", letterSpacing: "3px", textTransform: "uppercase", margin: 0 }}>
                Internship Completion Certificate
              </p>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#1e40af" }} />
              <div style={{ height: "1px", width: "60px", background: "#93c5fd" }} />
            </div>
          </div>

          {/* Body */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <p style={{ fontSize: "15px", color: "#475569", marginBottom: "12px", fontStyle: "italic" }}>
              This is to proudly certify that
            </p>
            <div style={{ margin: "12px 0 20px" }}>
              <p style={{
                fontSize: "38px", fontWeight: "700", color: "#0f172a",
                fontFamily: "Georgia, serif", letterSpacing: "1px",
                margin: "0 0 4px", borderBottom: "2px solid #1e40af",
                display: "inline-block", paddingBottom: "4px",
                paddingLeft: "24px", paddingRight: "24px",
              }}>
                {cleanName(certificate.studentName)}
              </p>
            </div>
            <p style={{ fontSize: "15px", color: "#475569", marginBottom: "12px", fontStyle: "italic" }}>
              has successfully completed the internship program in
            </p>
            <p style={{
              fontSize: "24px", fontWeight: "700", color: "#1e40af",
              letterSpacing: "1px", marginBottom: "16px", fontFamily: "Georgia, serif",
            }}>
              {certificate.domain}
            </p>

            {/* Date pill — data-date-pill used to locate position for canvas drawing */}
            <div
              data-date-pill
              style={{
                display: "inline-block",
                background: "#eff6ff",
                backgroundColor: "#eff6ff",
                border: "1px solid #93c5fd",
                borderRadius: "8px",
                padding: "10px 32px",
                minWidth: "280px",
                minHeight: "44px",
              }}
            >
              {/* Visible in browser — will be hidden in canvas clone and redrawn manually */}
              <p style={{
                fontSize: "15px",
                color: "rgb(30, 58, 138)",
                fontWeight: "700",
                margin: 0,
                fontFamily: "Arial, sans-serif",
                letterSpacing: "0.5px",
              }}>
                {startFormatted}&nbsp;&nbsp;—&nbsp;&nbsp;{endFormatted}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-end", borderTop: "1px solid #e2e8f0",
            paddingTop: "20px", marginTop: "8px",
          }}>
            {/* LEFT: Cert ID + QR */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "20px", flexShrink: 0 }}>
              <div>
                <p style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 4px" }}>
                  Certificate ID
                </p>
                <p style={{ fontSize: "15px", fontWeight: "700", color: "#1e3a8a", fontFamily: "monospace", margin: 0 }}>
                  {certificate.certificateId}
                </p>
                <p style={{ fontSize: "11px", color: "#94a3b8", margin: "4px 0 0" }}>
                  Issued: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                </p>
              </div>
              <div data-qr style={{ textAlign: "center" }}>
                <div style={{
                  padding: "5px", background: "#ffffff", backgroundColor: "#ffffff",
                  border: "2px solid #bfdbfe", borderRadius: "8px",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: "84px", height: "84px", boxSizing: "border-box", overflow: "hidden",
                }}>
                  <QRCodeSVG value={verifyUrl} size={70} bgColor="#ffffff" fgColor="#1e3a8a" level="M" style={{ display: "block" }} />
                </div>
                <p style={{ fontSize: "8px", color: "#94a3b8", margin: "4px 0 0", textAlign: "center" }}>
                  Scan to verify
                </p>
              </div>
            </div>

            {/* CENTRE: Seal */}
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div style={{
                width: "90px", height: "90px", border: "3px solid #1e40af", borderRadius: "50%",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                position: "relative", margin: "0 auto",
              }}>
                <div style={{
                  width: "78px", height: "78px", border: "1px dashed #93c5fd", borderRadius: "50%",
                  position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                }} />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p style={{ fontSize: "7px", fontWeight: "800", color: "#1e40af", textAlign: "center", letterSpacing: "0.5px", lineHeight: "1.3", margin: "2px 8px 0" }}>
                  VERIFIED<br />CERTIFICATE
                </p>
              </div>
            </div>

            {/* RIGHT: Signature */}
            <div data-signature style={{ textAlign: "right", flexShrink: 0, minWidth: "210px", overflow: "visible" }}>
              <p data-cursive style={{
                fontSize: "32px", color: "#1e3a8a", margin: "0",
                lineHeight: "1.4", fontFamily: "'Brush Script MT', 'Segoe Script', cursive",
                letterSpacing: "1px", display: "block", overflow: "visible",
                whiteSpace: "nowrap", paddingBottom: "4px",
              }}>
                Hitset Tech
              </p>
              <div data-sig-line style={{ borderBottom: "2px solid #1e3a8a", width: "100%", marginTop: "0", marginBottom: "8px" }} />
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#1e3a8a", margin: "0 0 2px", fontFamily: "Georgia, serif" }}>
                Authorized Signatory
              </p>
              <p style={{ fontSize: "11px", color: "#64748b", margin: 0 }}>HitSet Technologies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownloadPDF}
        disabled={pdfLoading}
        className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-10 py-3.5 rounded-xl transition-all duration-200 font-semibold text-sm hover:shadow-xl hover:shadow-blue-700/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        {pdfLoading ? "Generating PDF..." : "Download Certificate as PDF"}
      </button>
    </div>
  )
}

export default CertificateView