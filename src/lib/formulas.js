// Konstanta perhitungan
export const PI = 3.14
export const SAMBUNGAN_CM = 30
export const OVERSIZE_CM = 600 // > 6m, tambah 30cm lagi

export const METHODS = {
  1: { id: 1, label: 'Kurang dari ½ lingkaran', short: 'Kurang ½' },
  2: { id: 2, label: 'Setengah lingkaran pas', short: 'Pas ½' },
  3: { id: 3, label: 'Lebih dari ½ lingkaran', short: 'Lebih ½' }
}

/**
 * Hitung material aluminium bending
 * @param {number} method - 1, 2, atau 3
 * @param {number} lebar - cm
 * @param {number} tinggi - cm
 * @returns {Object} { ok, cm, steps, msg, msgType }
 */
export function calculate(method, lebar, tinggi) {
  const L = parseFloat(lebar)
  const T = parseFloat(tinggi)

  if (isNaN(L) || isNaN(T) || L <= 0 || T <= 0) {
    return { ok: false, cm: 0, steps: [], msg: null, msgType: null }
  }

  const half = L / 2

  // METODE 1: Kurang dari setengah lingkaran
  if (method === 1) {
    if (T > half) {
      return {
        ok: false,
        cm: 0,
        steps: [],
        msg: `Tinggi (${fmtCm(T)}) > Lebar÷2 (${fmtCm(half)}). Gunakan Metode 2 atau 3.`,
        msgType: 'warn'
      }
    }
    const cm = L + T + SAMBUNGAN_CM
    return {
      ok: true,
      cm,
      steps: [
        { label: 'Lebar + Tinggi', val: `${fmtCm(L)} + ${fmtCm(T)} = ${fmtCm(L + T)} cm` },
        { label: '+ 30 cm sambungan', val: `${fmtCm(cm)} cm` }
      ],
      msg: null,
      msgType: null
    }
  }

  // METODE 2: Setengah lingkaran pas
  if (method === 2) {
    const arc = half * PI
    const cm = arc + SAMBUNGAN_CM
    const steps = [
      { label: 'Lebar ÷ 2', val: `${fmtCm(L)} ÷ 2 = ${fmtCm(half)} cm` },
      { label: '× 3,14', val: `${fmtCm(half)} × 3,14 = ${fmtCm(arc)} cm` },
      { label: '+ 30 cm sambungan', val: `${fmtCm(cm)} cm` }
    ]
    let msg = null
    let msgType = null
    if (Math.abs(T - half) > 0.5) {
      msg = `Tinggi seharusnya ${fmtCm(half)} cm untuk setengah lingkaran pas. Hasil dihitung dari Lebar.`
      msgType = 'warn'
    }
    return { ok: true, cm, steps, msg, msgType }
  }

  // METODE 3: Lebih dari setengah lingkaran
  if (method === 3) {
    if (T < half) {
      return {
        ok: false,
        cm: 0,
        steps: [],
        msg: `Tinggi (${fmtCm(T)}) < Lebar÷2 (${fmtCm(half)}). Tinggi minimum: ${fmtCm(half)} cm.`,
        msgType: 'error'
      }
    }
    const sisi = (T - half) * 2
    const arc = half * PI
    let cm = arc + sisi + SAMBUNGAN_CM
    const steps = [
      { label: 'Lebar ÷ 2', val: `${fmtCm(L)} ÷ 2 = ${fmtCm(half)} cm` },
      { label: 'Tinggi − (Lebar÷2)', val: `${fmtCm(T)} − ${fmtCm(half)} = ${fmtCm(T - half)} cm` },
      { label: '× 2 (sisi lurus)', val: `${fmtCm(T - half)} × 2 = ${fmtCm(sisi)} cm` },
      { label: '(Lebar÷2) × 3,14 (busur)', val: `${fmtCm(half)} × 3,14 = ${fmtCm(arc)} cm` },
      { label: 'Busur + sisi + 30', val: `${fmtCm(cm)} cm` }
    ]
    let msg = null
    let msgType = null
    if (cm > OVERSIZE_CM) {
      cm += SAMBUNGAN_CM
      steps.push({ label: '+ 30 cm (panjang > 6 m)', val: `${fmtCm(cm)} cm` })
      msg = 'Panjang melebihi 6 m, otomatis ditambahkan 30 cm.'
      msgType = 'info'
    }
    return { ok: true, cm, steps, msg, msgType }
  }

  return { ok: false, cm: 0, steps: [], msg: null, msgType: null }
}

// Format helper
export function fmtCm(n) {
  const r = Math.round(n * 100) / 100
  if (r % 1 === 0) return r.toString()
  return r.toFixed(2).replace(/\.?0+$/, '').replace('.', ',')
}
