import { useState, useEffect, useMemo } from 'react'
import { calculate, METHODS, fmtCm } from '../lib/formulas'
import { fmtMeter, fmtMeterFull, fmtIDR, fmtIDRWithRp, calcItemPrice, fmtSize, roundMeter } from '../lib/format'

export default function Calculator({ products, onAddToQuotation }) {
  const [method, setMethod] = useState(1)
  const [lebar, setLebar] = useState('')
  const [tinggi, setTinggi] = useState('')
  const [productId, setProductId] = useState('')
  const [qty, setQty] = useState(1)
  const [customLabel, setCustomLabel] = useState('')

  // Auto-fill tinggi untuk metode 2
  useEffect(() => {
    if (method === 2 && lebar) {
      const half = parseFloat(lebar) / 2
      if (!isNaN(half)) setTinggi(half.toString())
    }
  }, [method, lebar])

  const result = useMemo(
    () => calculate(method, lebar, tinggi),
    [method, lebar, tinggi]
  )

  const product = products.find((p) => p.id === productId)

  const meterPerPcs = result.ok ? roundMeter(result.cm) : 0
  const totalMeter = meterPerPcs * qty
  const totalPrice = product && result.ok ? calcItemPrice({
    cmPerPcs: result.cm,
    qty,
    pricePerMeter: product.price
  }) : 0

  const handleAdd = () => {
    if (!result.ok || !product) return
    onAddToQuotation({
      id: 'q' + Date.now(),
      productName: customLabel.trim() || product.name,
      pricePerMeter: product.price,
      method,
      lebar: parseFloat(lebar),
      tinggi: parseFloat(tinggi),
      qty,
      cmPerPcs: result.cm
    })
    // Reset form ringan
    setLebar('')
    setTinggi('')
    setQty(1)
    setCustomLabel('')
  }

  const formulaHints = {
    1: 'Lebar + Tinggi + 30 cm',
    2: '(Lebar ÷ 2) × 3,14 + 30 cm',
    3: '(Lebar ÷ 2) × 3,14 + 2×(T − L÷2) + 30 cm'
  }

  return (
    <div className="space-y-4">
      {/* Method picker */}
      <div>
        <label className="text-xs text-slate-400 mb-2 block">Metode bending</label>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`p-3 rounded-lg border text-left transition ${
                method === m
                  ? 'border-amber-500 bg-amber-500/10 text-amber-200'
                  : 'border-slate-700 bg-slate-800/50 text-slate-300 active:bg-slate-700'
              }`}
            >
              <div className="text-[10px] font-mono text-slate-400 mb-1">METODE {m}</div>
              <div className="text-xs leading-tight font-medium">{METHODS[m].label}</div>
            </button>
          ))}
        </div>
        <div className="mt-2 px-3 py-2 bg-slate-800/60 rounded-md text-xs font-mono text-slate-300">
          {formulaHints[method]}
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="Lebar"
          suffix="cm"
          value={lebar}
          onChange={setLebar}
          inputMode="decimal"
        />
        <InputField
          label={method === 2 ? 'Tinggi (auto)' : 'Tinggi'}
          suffix="cm"
          value={tinggi}
          onChange={setTinggi}
          disabled={method === 2}
          inputMode="decimal"
        />
      </div>

      {/* Product picker */}
      <div>
        <label className="text-xs text-slate-400 mb-1.5 block">Produk</label>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
        >
          <option value="">— pilih produk —</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — Rp {p.price.toLocaleString('id-ID')}/m
            </option>
          ))}
        </select>
      </div>

      {/* Custom label */}
      {productId && (
        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">
            Label kustom (opsional)
            <span className="text-slate-500 ml-1">— override nama produk untuk item ini</span>
          </label>
          <input
            type="text"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            placeholder={product?.name || ''}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
          />
        </div>
      )}

      {/* Quantity */}
      <div>
        <label className="text-xs text-slate-400 mb-1.5 block">Jumlah</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-lg text-lg active:bg-slate-700"
          >
            −
          </button>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
            inputMode="numeric"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-center font-mono focus:border-amber-500 focus:outline-none"
          />
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-lg text-lg active:bg-slate-700"
          >
            +
          </button>
          <span className="text-xs text-slate-500 ml-1">pcs</span>
        </div>
      </div>

      {/* Messages */}
      {result.msg && (
        <div
          className={`px-3 py-2.5 rounded-lg text-xs ${
            result.msgType === 'error'
              ? 'bg-red-900/40 border border-red-800 text-red-200'
              : result.msgType === 'info'
              ? 'bg-blue-900/40 border border-blue-800 text-blue-200'
              : 'bg-amber-900/40 border border-amber-800 text-amber-200'
          }`}
        >
          {result.msg}
        </div>
      )}

      {/* Breakdown */}
      {result.ok && result.steps.length > 0 && (
        <details className="bg-slate-800/40 border border-slate-700 rounded-lg overflow-hidden">
          <summary className="px-3 py-2.5 text-xs text-slate-400 cursor-pointer select-none">
            Lihat breakdown perhitungan
          </summary>
          <div className="border-t border-slate-700">
            {result.steps.map((s, i) => (
              <div
                key={i}
                className="flex justify-between items-center px-3 py-2 text-xs font-mono border-b border-slate-700/50 last:border-0"
              >
                <span className="text-slate-400">{s.label}</span>
                <span className="text-slate-200">{s.val}</span>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Results */}
      {result.ok && (
        <div className="space-y-2.5 pt-1">
          <div className="grid grid-cols-2 gap-2">
            <ResultCard label="Per pcs" value={fmtMeterFull(result.cm)} />
            <ResultCard label={`Total (${qty} pcs)`} value={`${totalMeter.toFixed(1).replace('.',',')} m`} />
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <div className="text-xs text-amber-300/80 mb-1">Total harga</div>
            <div className="text-2xl font-mono font-medium text-amber-200">
              {product ? fmtIDRWithRp(totalPrice) : 'Pilih produk dulu'}
            </div>
            {product && lebar && tinggi && (
              <div className="text-[11px] text-amber-300/60 mt-2 font-mono">
                {customLabel.trim() || product.name} {fmtSize(lebar, tinggi)} : {fmtMeter(result.cm)} x {qty}pcs x {fmtIDR(product.price)}
              </div>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={!product}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-medium py-3 rounded-lg transition"
          >
            + Tambahkan ke Quotation
          </button>
        </div>
      )}

      {products.length === 0 && (
        <div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-lg p-4 text-center">
          <div className="text-sm text-slate-300 mb-1">Belum ada produk</div>
          <div className="text-xs text-slate-500">Tambahkan dulu di tab Produk</div>
        </div>
      )}
    </div>
  )
}

function InputField({ label, suffix, value, onChange, disabled, inputMode }) {
  return (
    <div>
      <label className="text-xs text-slate-400 mb-1.5 block">{label}</label>
      <div className="relative">
        <input
          type="number"
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="0"
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 pr-10 text-base font-mono focus:border-amber-500 focus:outline-none disabled:opacity-60"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono pointer-events-none">
          {suffix}
        </span>
      </div>
    </div>
  )
}

function ResultCard({ label, value }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3">
      <div className="text-[11px] text-slate-400 mb-0.5">{label}</div>
      <div className="text-lg font-mono font-medium">{value}</div>
    </div>
  )
}
