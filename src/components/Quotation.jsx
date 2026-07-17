import { useState } from 'react'
import { fmtMeterFull, fmtIDRWithRp, fmtIDR, fmtMeter, fmtSize, formatQuotationText, calcItemPrice, roundMeter } from '../lib/format'
import { METHODS } from '../lib/formulas'

export default function Quotation({ items, setItems, onClear }) {
  const [customer, setCustomer] = useState('')
  const [notes, setNotes] = useState('')
  const [copied, setCopied] = useState(false)

  const total = items.reduce((sum, it) => sum + calcItemPrice(it), 0)
  const totalMeter = items.reduce((sum, it) => sum + roundMeter(it.cmPerPcs) * it.qty, 0)

  const handleRemove = (id) => {
    setItems(items.filter((i) => i.id !== id))
  }

  const handleClear = () => {
    if (!confirm('Kosongkan semua item?')) return
    onClear()
    setCustomer('')
    setNotes('')
  }

  const text = formatQuotationText(items, customer, notes)

  const handleCopy = async () => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      // Fallback
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  const handleShareWA = () => {
    if (!text) return
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-base text-slate-600 mb-2">Belum ada item</div>
        <div className="text-xs text-slate-400">Hitung dulu di tab Hitung, lalu tambahkan ke quotation</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <input
          type="text"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          placeholder="Nama customer (mis. Danang w, 4&quot; hitam ad)"
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:border-blue-600 focus:outline-none"
        />
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Catatan (opsional)"
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:border-blue-600 focus:outline-none"
        />
      </div>

      {/* Items */}
      <div className="space-y-2">
        {items.map((item) => {
          const price = calcItemPrice(item)
          return (
            <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
              <div className="flex justify-between items-start gap-2 mb-1.5">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-800">
                    {item.productName}{' '}
                    <span className="font-mono text-blue-700">
                      {fmtSize(item.lebar, item.tinggi)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {METHODS[item.method].label} · {fmtMeterFull(item.cmPerPcs)} × {item.qty}pcs
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-slate-400 hover:text-red-500 text-xs px-2 py-1"
                >
                  ✕
                </button>
              </div>
              <div className="font-mono text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded px-2 py-1.5">
                {fmtMeter(item.cmPerPcs)} × {item.qty}pcs × {fmtIDR(item.pricePerMeter)} ={' '}
                <span className="text-blue-700 font-medium">{fmtIDR(price)}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Total */}
      <div className="bg-blue-700 rounded-lg p-4 text-white shadow-sm">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-blue-100">Total material</span>
          <span className="text-xs font-mono text-blue-100">{totalMeter.toFixed(1).replace('.', ',')} m</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-blue-100">Total keseluruhan</span>
          <span className="text-xl font-mono font-medium">{fmtIDRWithRp(total)}</span>
        </div>
      </div>

      {/* Preview text */}
      <details className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <summary className="px-3 py-2.5 text-xs text-slate-500 cursor-pointer">
          Preview teks (gaya WhatsApp)
        </summary>
        <pre className="px-3 py-3 text-[11px] font-mono text-slate-700 whitespace-pre-wrap border-t border-slate-200 bg-slate-50">
{text}
        </pre>
      </details>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 no-print">
        <button
          onClick={handleCopy}
          className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2.5 rounded-lg text-sm"
        >
          {copied ? '✓ Tersalin' : 'Salin teks'}
        </button>
        <button
          onClick={handleShareWA}
          className="bg-green-600 hover:bg-green-500 text-white font-medium py-2.5 rounded-lg text-sm"
        >
          Kirim via WA
        </button>
      </div>
      <button
        onClick={handleClear}
        className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 py-2 rounded-lg text-xs no-print"
      >
        Kosongkan quotation
      </button>
    </div>
  )
}
