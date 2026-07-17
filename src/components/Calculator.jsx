import { useState, useEffect, useMemo } from 'react'
import { calculate, METHODS } from '../lib/formulas'
import { fmtMeter, fmtMeterFull, fmtIDR, fmtIDRWithRp, calcItemPrice, fmtSize, roundMeter } from '../lib/format'
import { useLocalStorage } from '../lib/useLocalStorage'

export default function Calculator({ onAddToQuotation }) {
  const [method, setMethod] = useState(1)
  const [lebar, setLebar] = useState('')
  const [tinggi, setTinggi] = useState('')
  const [itemName, setItemName] = useLocalStorage('toto.lastItemName', '')
  const [pricePerMeter, setPricePerMeter] = useLocalStorage('toto.lastPrice', '')
  const [qty, setQty] = useState(1)

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

  const price = parseFloat(pricePerMeter)
  const hasPrice = !isNaN(price) && price > 0

  const meterPerPcs = result.ok ? roundMeter(result.cm) : 0
  const totalMeter = meterPerPcs * qty
  const totalPrice = hasPrice && result.ok
    ? calcItemPrice({ cmPerPcs: result.cm, qty, pricePerMeter: price })
    : 0

  const canAdd = result.ok && hasPrice && itemName.trim() !== ''

  const handleAdd = () => {
    if (!canAdd) return
    onAddToQuotation({
      id: 'q' + Date.now(),
      productName: itemName.trim(),
      pricePerMeter: price,
      method,
      lebar: parseFloat(lebar),
      tinggi: parseFloat(tinggi),
      qty,
      cmPerPcs: result.cm
    })
    // Reset form ringan — nama & harga tetap tersimpan untuk item berikutnya
    setLebar('')
    setTinggi('')
    setQty(1)
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
        <label className="text-xs text-slate-500 mb-2 block font-medium">Metode bending</label>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`p-3 rounded-lg border text-left transition ${
                method === m
                  ? 'border-blue-600 bg-blue-50 text-blue-800'
                  : 'border-slate-200 bg-white text-slate-600 active:bg-slate-50'
              }`}
            >
              <div className="text-[10px] font-mono text-slate-400 mb-1">METODE {m}</div>
              <div className="text-xs leading-tight font-medium">{METHODS[m].label}</div>
            </button>
          ))}
        </div>
        <div className="mt-2 px-3 py-2 bg-white border border-slate-200 rounded-md text-xs font-mono text-slate-600">
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

      {/* Item & harga */}
      <div>
        <label className="text-xs text-slate-500 mb-1.5 block font-medium">Nama item</label>
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder={'mis. 4" hitam ad'}
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:border-blue-600 focus:outline-none"
        />
      </div>
      <div>
        <label className="text-xs text-slate-500 mb-1.5 block font-medium">Harga per meter</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono pointer-events-none">
            Rp
          </span>
          <input
            type="number"
            inputMode="numeric"
            value={pricePerMeter}
            onChange={(e) => setPricePerMeter(e.target.value)}
            placeholder="0"
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-base font-mono text-slate-800 focus:border-blue-600 focus:outline-none"
          />
        </div>
        {hasPrice && (
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            Rp {fmtIDR(price)}/meter
          </div>
        )}
      </div>

      {/* Quantity */}
      <div>
        <label className="text-xs text-slate-500 mb-1.5 block font-medium">Jumlah</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-10 bg-white border border-slate-200 rounded-lg text-lg text-slate-600 active:bg-slate-50"
          >
            −
          </button>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
            inputMode="numeric"
            className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-center font-mono text-slate-800 focus:border-blue-600 focus:outline-none"
          />
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-10 h-10 bg-white border border-slate-200 rounded-lg text-lg text-slate-600 active:bg-slate-50"
          >
            +
          </button>
          <span className="text-xs text-slate-400 ml-1">pcs</span>
        </div>
      </div>

      {/* Messages */}
      {result.msg && (
        <div
          className={`px-3 py-2.5 rounded-lg text-xs border ${
            result.msgType === 'error'
              ? 'bg-red-50 border-red-200 text-red-700'
              : result.msgType === 'info'
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-amber-50 border-amber-200 text-amber-700'
          }`}
        >
          {result.msg}
        </div>
      )}

      {/* Breakdown */}
      {result.ok && result.steps.length > 0 && (
        <details className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <summary className="px-3 py-2.5 text-xs text-slate-500 cursor-pointer select-none">
            Lihat breakdown perhitungan
          </summary>
          <div className="border-t border-slate-200">
            {result.steps.map((s, i) => (
              <div
                key={i}
                className="flex justify-between items-center px-3 py-2 text-xs font-mono border-b border-slate-100 last:border-0"
              >
                <span className="text-slate-500">{s.label}</span>
                <span className="text-slate-800">{s.val}</span>
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
            <ResultCard label={`Total (${qty} pcs)`} value={`${totalMeter.toFixed(1).replace('.', ',')} m`} />
          </div>
          <div className="bg-blue-700 rounded-lg p-4 text-white shadow-sm">
            <div className="text-xs text-blue-100 mb-1">Total harga</div>
            <div className="text-2xl font-mono font-medium">
              {hasPrice ? fmtIDRWithRp(totalPrice) : 'Isi harga per meter'}
            </div>
            {hasPrice && lebar && tinggi && (
              <div className="text-[11px] text-blue-200 mt-2 font-mono">
                {itemName.trim() || 'Item'} {fmtSize(lebar, tinggi)} : {fmtMeter(result.cm)} x {qty}pcs x {fmtIDR(price)}
              </div>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={!canAdd}
            className="w-full bg-blue-700 hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium py-3 rounded-lg transition shadow-sm"
          >
            + Tambahkan ke Quotation
          </button>
          {!canAdd && (
            <div className="text-[11px] text-slate-400 text-center">
              {itemName.trim() === '' ? 'Isi nama item dulu' : !hasPrice ? 'Isi harga per meter dulu' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function InputField({ label, suffix, value, onChange, disabled, inputMode }) {
  return (
    <div>
      <label className="text-xs text-slate-500 mb-1.5 block font-medium">{label}</label>
      <div className="relative">
        <input
          type="number"
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="0"
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 pr-10 text-base font-mono text-slate-800 focus:border-blue-600 focus:outline-none disabled:opacity-60 disabled:bg-slate-50"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono pointer-events-none">
          {suffix}
        </span>
      </div>
    </div>
  )
}

function ResultCard({ label, value }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
      <div className="text-[11px] text-slate-500 mb-0.5">{label}</div>
      <div className="text-lg font-mono font-medium text-slate-800">{value}</div>
    </div>
  )
}
