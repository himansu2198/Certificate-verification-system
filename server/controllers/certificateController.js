const xlsx = require("xlsx")
const Certificate = require("../models/Certificate")

const parseExcelDate = (value) => {
  if (value === null || value === undefined || value === "") return null

  // ── 1. Pure Excel serial number (raw:true gives these) ──────────────────
  if (typeof value === "number") {
    // Manual Excel serial → UTC date
    // Excel serial 1 = Jan 1 1900. Epoch offset = Dec 30 1899 UTC.
    const excelEpoch = new Date(Date.UTC(1899, 11, 30))
    const result = new Date(excelEpoch.getTime() + Math.round(value) * 86400000)
    if (result.getUTCFullYear() >= 2000) return result
    return null
  }

  if (typeof value === "string") {
    const t = value.trim()
    if (!t) return null

    // ── 2. DD-MM-YYYY  e.g. 11-01-2026 ─────────────────────────────────
    let m = t.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/)
    if (m) {
      const d = new Date(Date.UTC(+m[3], +m[2] - 1, +m[1]))
      if (!isNaN(d) && d.getUTCFullYear() >= 2000) return d
    }

    // ── 3. DD/MM/YYYY  e.g. 11/01/2026 ─────────────────────────────────
    m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
    if (m) {
      const d = new Date(Date.UTC(+m[3], +m[2] - 1, +m[1]))
      if (!isNaN(d) && d.getUTCFullYear() >= 2000) return d
    }

    // ── 4. M/D/YYYY  e.g. 1/11/2026  (xlsx raw:false output) ────────────
    m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
    if (m) {
      // Try both MM/DD and DD/MM — pick the one that gives year >= 2000
      const asMMDD = new Date(Date.UTC(+m[3], +m[1] - 1, +m[2]))
      if (!isNaN(asMMDD) && asMMDD.getUTCFullYear() >= 2000) return asMMDD
      const asDDMM = new Date(Date.UTC(+m[3], +m[2] - 1, +m[1]))
      if (!isNaN(asDDMM) && asDDMM.getUTCFullYear() >= 2000) return asDDMM
    }

    // ── 5. YYYY-MM-DD  e.g. 2026-01-11 ──────────────────────────────────
    m = t.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (m) {
      const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]))
      if (!isNaN(d) && d.getUTCFullYear() >= 2000) return d
    }

    // ── 6. ISO string  e.g. "2026-01-11T00:00:00.000Z" ──────────────────
    if (t.includes("T") || t.includes("Z")) {
      const d = new Date(t)
      if (!isNaN(d) && d.getUTCFullYear() >= 2000) return d
    }
  }

  // ── 7. Native Date object (xlsx cellDates:true gives these) ─────────────
  if (value instanceof Date) {
    if (!isNaN(value.getTime()) && value.getUTCFullYear() >= 2000) return value
  }

  return null
}

const uploadCertificates = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    // Try both raw:true and raw:false approaches
    // raw:true  → serial numbers (numbers) — handled by case 1 above
    // raw:false → formatted strings        — handled by cases 2-5 above
    const workbook = xlsx.read(req.file.buffer, { type: "buffer", cellDates: false })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]

    // Use raw:false to get strings, but also get raw values as fallback
    const rows     = xlsx.utils.sheet_to_json(sheet, { raw: false })
    const rawRows  = xlsx.utils.sheet_to_json(sheet, { raw: true })

    if (rows.length === 0) {
      return res.status(400).json({ message: "Excel file is empty" })
    }

    const errors = []
    const validRecords = []

    rows.forEach((row, index) => {
      const rowNum = index + 2
      const raw    = rawRows[index] || {}

      const { certificateId, studentName, domain } = row

      // For dates: prefer raw value (serial number) over formatted string
      const startRaw = raw.startDate  ?? row.startDate
      const endRaw   = raw.endDate    ?? row.endDate

      if (!certificateId) return errors.push(`Row ${rowNum}: certificateId is required`)
      if (!studentName)   return errors.push(`Row ${rowNum}: studentName is required`)
      if (!domain)        return errors.push(`Row ${rowNum}: domain is required`)
      if (!startRaw)      return errors.push(`Row ${rowNum}: startDate is required`)
      if (!endRaw)        return errors.push(`Row ${rowNum}: endDate is required`)

      const parsedStart = parseExcelDate(startRaw)
      const parsedEnd   = parseExcelDate(endRaw)

      if (!parsedStart) return errors.push(`Row ${rowNum}: startDate "${startRaw}" could not be parsed — use DD-MM-YYYY`)
      if (!parsedEnd)   return errors.push(`Row ${rowNum}: endDate "${endRaw}" could not be parsed — use DD-MM-YYYY`)
      if (parsedEnd <= parsedStart) return errors.push(`Row ${rowNum}: endDate must be after startDate`)

      // Strip trailing row numbers from names e.g. "Neha Gupta 21" → "Neha Gupta"
      const cleanName = String(studentName).trim().replace(/\s+\d+$/, "")

      validRecords.push({
        certificateId: String(certificateId).trim(),
        studentName:   cleanName,
        domain:        String(domain).trim(),
        startDate:     parsedStart,
        endDate:       parsedEnd,
      })
    })

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation failed. No records were inserted.",
        errors,
      })
    }

    let insertedCount = 0
    const duplicates  = []

    try {
      const result = await Certificate.insertMany(validRecords, { ordered: false })
      insertedCount = result.length
    } catch (bulkError) {
      if (bulkError.code === 11000 || bulkError.name === "BulkWriteError") {
        insertedCount = bulkError.result?.nInserted ?? 0
        ;(bulkError.writeErrors || []).forEach((e) => {
          duplicates.push(validRecords[e.index]?.certificateId || "unknown")
        })
      } else {
        throw bulkError
      }
    }

    res.status(200).json({
      message: `Upload complete. ${insertedCount} record(s) inserted.`,
      inserted: insertedCount,
      duplicatesSkipped: duplicates.length,
      duplicateIds: duplicates,
    })
  } catch (error) {
    console.error("Upload error:", error)
    res.status(500).json({ message: "Server error during upload" })
  }
}

module.exports = { uploadCertificates }