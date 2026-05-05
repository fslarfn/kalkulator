// Format harga dalam Rupiah Indonesia (titik sebagai pemisah ribuan)
export function fmtIDR(n) {
  return Math.round(n).toLocaleString('id-ID')
}

export function fmtIDRWithRp(n) {
  return 'Rp ' + fmtIDR(n)
}

// Bulatkan ke 1 desimal dengan aturan: angka ke-2 setelah koma >= 5 dibulatkan ke atas
// (round half away from zero, bukan banker's rounding default JavaScript)
export function roundMeter(cm) {
  const m = cm / 100
  return Math.round(m * 10 + Number.EPSILON) / 10
}

// Format meter dengan 1 desimal, koma sebagai pemisah desimal (2,1 bukan 2.1)
export function fmtMeter(cm) {
  return roundMeter(cm).toFixed(1).replace('.', ',')
}

// Format meter dengan suffix m
export function fmtMeterFull(cm) {
  return fmtMeter(cm) + ' m'
}

// Format ukuran cm seperti L.130 T.50
export function fmtSize(lebar, tinggi) {
  // Jika lebar = tinggi, gunakan notasi D (Diameter) seperti gaya output Anda
  if (parseFloat(lebar) === parseFloat(tinggi)) {
    return `D.${formatNum(lebar)}`
  }
  return `L.${formatNum(lebar)} T.${formatNum(tinggi)}`
}

function formatNum(n) {
  const num = parseFloat(n)
  if (num % 1 === 0) return num.toString()
  return num.toFixed(1).replace('.', ',')
}

/**
 * Format satu item ke gaya output WA Anda:
 * "4" hitam ad L.130 T.50 : 2,1 x 2pcs x 230.000 = 966.000"
 * Harga dihitung dari meter yang sudah dibulatkan (1,7 m, bukan 1,713 m)
 */
export function formatItemLine(item) {
  const size = fmtSize(item.lebar, item.tinggi)
  const meterPerPcsRounded = roundMeter(item.cmPerPcs)
  const meterStr = meterPerPcsRounded.toFixed(1).replace('.', ',')
  const totalPrice = meterPerPcsRounded * item.qty * item.pricePerMeter

  return `${item.productName} ${size} : ${meterStr} x ${item.qty}pcs x ${fmtIDR(item.pricePerMeter)} = ${fmtIDR(totalPrice)}`
}

/**
 * Generate full quotation text (gaya WA)
 */
export function formatQuotationText(items, customer = '', notes = '') {
  if (items.length === 0) return ''

  const lines = items.map(formatItemLine)
  const total = items.reduce((sum, it) => sum + calcItemPrice(it), 0)

  let txt = lines.join('\n\n')
  txt += `\n\nTotal keseluruhan : ${fmtIDR(total)}`

  if (customer) {
    txt = `${customer}\n\n${txt}`
  }
  if (notes) {
    txt += `\n\nCatatan: ${notes}`
  }
  return txt
}

// Hitung total harga dari item — pakai meter yang sudah dibulatkan
export function calcItemPrice(item) {
  const meterRounded = roundMeter(item.cmPerPcs)
  return meterRounded * item.qty * item.pricePerMeter
}
