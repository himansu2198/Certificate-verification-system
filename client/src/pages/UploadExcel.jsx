import { useState, useRef, useCallback } from "react"
import { Link } from "react-router-dom"
import Sidebar from "../components/Sidebar"

const sampleFormat = [
  { certificateId: "CV2024001", studentName: "John Doe", domain: "Web Development", startDate: "01-01-2024", endDate: "31-03-2024" },
  { certificateId: "CV2024002", studentName: "Jane Smith", domain: "Data Science", startDate: "01-02-2024", endDate: "30-04-2024" },
]

const tips = [
  "certificateId must be unique for each student",
  "Dates must be in DD-MM-YYYY format",
  "Do not leave any fields empty",
  "File size should not exceed 5MB",
  "Supported formats: .xlsx and .xls only",
]

function UploadExcel() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const fileInputRef = useRef(null)

  const handleFile = (selectedFile) => {
    if (!selectedFile) return
    const allowed = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"]
    if (!allowed.includes(selectedFile.type) && !selectedFile.name.match(/\.(xlsx|xls)$/)) {
      setError({ message: "Only .xlsx and .xls files are allowed" })
      return
    }
    setFile(selectedFile)
    setResult(null)
    setError(null)
    setShowSuccess(false)
  }

  const handleFileChange = (e) => handleFile(e.target.files[0])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }, [])

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true) }
  const handleDragLeave = (e) => {
    // Only fire when leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(false)
  }

  const removeFile = () => {
    setFile(null); setResult(null); setError(null); setShowSuccess(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    setResult(null); setError(null); setShowSuccess(false)
    if (!file) { setError({ message: "Please select an Excel file" }); return }
    const token = localStorage.getItem("adminToken")
    if (!token) { setError({ message: "You are not logged in. Please login again." }); return }

    const formData = new FormData()
    formData.append("file", file)
    setLoading(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress(prev => prev < 85 ? prev + Math.random() * 12 : prev)
    }, 180)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/certificates/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      clearInterval(interval)
      setProgress(100)
      const data = await res.json()
      if (!res.ok) {
        setError(data.errors?.length ? { message: data.message, errors: data.errors } : { message: data.message || "Upload failed" })
        return
      }
      setResult(data)
      setShowSuccess(true)
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch {
      clearInterval(interval)
      setError({ message: "Server error. Please try again." })
    } finally {
      setLoading(false)
      setTimeout(() => setProgress(0), 1200)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Upload Certificates</h1>
            <p className="text-slate-400 text-sm mt-0.5">Bulk import student certificates via Excel</p>
          </div>
          <Link to="/dashboard" className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1.5 font-medium transition-colors duration-200">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left — Upload area */}
          <div className="lg:col-span-2 space-y-5">

            {/* Drop Zone */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="text-base font-bold text-slate-800 mb-4">Select File</h2>

              {!file ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
                    dragOver
                      ? "border-blue-500 bg-blue-50 scale-[1.02] shadow-lg shadow-blue-100"
                      : "border-slate-200 hover:border-blue-300 hover:bg-slate-50/80"
                  }`}
                >
                  <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all duration-200 ${dragOver ? "bg-blue-100 scale-110" : "bg-slate-100"}`}>
                    <svg className={`w-8 h-8 transition-colors duration-200 ${dragOver ? "text-blue-600" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <p className={`font-bold text-base mb-1 transition-colors duration-200 ${dragOver ? "text-blue-700" : "text-slate-700"}`}>
                    {dragOver ? "Release to upload!" : "Drag & Drop Excel File Here"}
                  </p>
                  <p className="text-slate-400 text-sm mb-3">or click to browse from your computer</p>
                  <span className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full transition-colors duration-200 ${dragOver ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
                    .xlsx and .xls supported · Max 5MB
                  </span>
                  <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" />
                </div>
              ) : (
                <div className="border-2 border-blue-200 bg-blue-50/30 rounded-2xl p-5 flex items-center gap-4 transition-all duration-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{file.name}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{formatSize(file.size)}</p>
                  </div>
                  <button onClick={removeFile}
                    className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors duration-200 shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {loading && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6" style={{ animation: "fadeIn 0.3s ease" }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-semibold text-slate-700">Uploading & processing...</p>
                  </div>
                  <p className="text-sm font-bold text-blue-600 tabular-nums">{Math.round(progress)}%</p>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">Validating rows and inserting records...</p>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl transition-all duration-200 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none text-sm"
            >
              {loading ? "Processing..." : "Upload & Import Certificates"}
            </button>

            {/* Success */}
            {result && showSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5" style={{ animation: "successPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center" style={{ animation: "checkPop 0.4s ease 0.1s both" }}>
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-green-800">{result.message}</p>
                    <p className="text-xs text-green-600 mt-0.5">All records processed successfully</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl p-3 border border-green-100">
                    <p className="text-xs text-slate-400 mb-1">Records Inserted</p>
                    <p className="text-2xl font-bold text-green-600">{result.inserted}</p>
                  </div>
                  {result.duplicatesSkipped > 0 && (
                    <div className="bg-white rounded-xl p-3 border border-yellow-100">
                      <p className="text-xs text-slate-400 mb-1">Duplicates Skipped</p>
                      <p className="text-2xl font-bold text-yellow-500">{result.duplicatesSkipped}</p>
                    </div>
                  )}
                </div>
                {result.duplicateIds?.length > 0 && (
                  <p className="text-xs text-yellow-600 mt-3 bg-yellow-50 rounded-lg px-3 py-2">
                    Skipped IDs: {result.duplicateIds.join(", ")}
                  </p>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5" style={{ animation: "fadeIn 0.25s ease" }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="font-bold text-red-700">{error.message}</p>
                </div>
                {error.errors?.length > 0 && (
                  <ul className="mt-3 space-y-1.5 max-h-40 overflow-y-auto">
                    {error.errors.map((err, i) => (
                      <li key={i} className="text-xs text-red-600 flex items-start gap-2 bg-white rounded-lg px-3 py-2 border border-red-100">
                        <span className="text-red-300 mt-0.5">•</span>{err}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Right — Guide & Tips */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Excel Format Guide</h3>
              </div>
              <p className="text-xs text-slate-400 mb-3">Your Excel file must have these exact column headers:</p>
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      {["certificateId", "studentName", "domain", "startDate", "endDate"].map(col => (
                        <th key={col} className="px-2 py-2 text-left font-bold text-slate-600 whitespace-nowrap border-b border-slate-100">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sampleFormat.map((row, i) => (
                      <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                        <td className="px-2 py-2 font-mono text-blue-600 whitespace-nowrap">{row.certificateId}</td>
                        <td className="px-2 py-2 text-slate-700 whitespace-nowrap">{row.studentName}</td>
                        <td className="px-2 py-2 text-slate-700 whitespace-nowrap">{row.domain}</td>
                        <td className="px-2 py-2 text-slate-500 whitespace-nowrap">{row.startDate}</td>
                        <td className="px-2 py-2 text-slate-500 whitespace-nowrap">{row.endDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold text-xs py-2.5 rounded-xl transition-colors duration-200 hover:-translate-y-0.5 active:translate-y-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Sample Excel
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Upload Tips</h3>
              </div>
              <ul className="space-y-2.5">
                {tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                    <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes successPop { 0% { opacity: 0; transform: scale(0.95) translateY(8px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes checkPop { 0% { transform: scale(0); } 70% { transform: scale(1.2); } 100% { transform: scale(1); } }
      `}</style>
    </div>
  )
}

export default UploadExcel