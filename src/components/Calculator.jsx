import { useState, useEffect, useMemo } from 'react'
import { calculate, METHODS } from '../lib/formulas'
import { fmtMeter, fmtMeterFull, fmtIDR, fmtIDRWithRp, calcItemPrice, fmtSize, roundMeter } from '../lib/format'
import { useLocalStorage } from '../lib/useLocalStorage'
import { ArchIcon } from './Shapes'

const METHOD_DESC = {
  1: 'Tinggi lengkung kurang dari Lebar ÷ 2',
  2: 'Tinggi lengkung sama dengan Lebar ÷ 2',
  3: 'Tinggi lengkung lebih dari Lebar ÷ 2'
}

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
    setLebar('')
    setTinggi('')
    setQty(1)
  }

  const formulaHints = {
    1: 'Rumus: Lebar + Tinggi + 30 cm',
    2: 'Rumus: (Lebar ÷ 2) × 3,14 + 30 cm',
    3: 'Rumus: (Lebar ÷ 2) × 3,14 + 2×(T − L÷2) + 30 cm'
  }

  return (
    <div className="bg-white rounded-2xl border border-brand-200 shadow-sm p-4 space-y-5">
      {/* Step 1 — bentuk */}
      <section>
        <StepTitle no="1">Pilih bentuk lengkungan</StepTitle>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`p-2.5 rounded-xl border text-center transition ${
                method === m
                  ? 'border-brand-700 border-2 bg-brand-100'
                  : 'border-brand-200 bg-white active:bg-brand-50'
              }`}
            >
              <ArchIcon type={m} active={method === m} className="w-full h-9 mb-1.5" />
              <div className={`text-[11px] leading-tight font-semibold ${method === m ? 'text-brand-900' : 'text-brand-700'}`}>
                {METHODS[m].label}
              </div>
              <div className="text-[9px] leading-tight text-brand-400 mt-1">
                {METHOD_DESC[m]}
              </div>
            </button>
          ))}
        </div>
        <div className="mt-2.5 px-3 py-2 bg-brand-100 rounded-lg text-xs font-mono text-brand-800">
          {formulaHints[method]}
        </div>
      </section>

      {/* Step 2 — ukuran */}
      <section>
        <StepTitle no="2">Masukkan ukuran</StepTitle>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Lebar" suffix="cm" value={lebar} onChange={setLebar} inputMode="decimal" />
          <InputField
            label={method === 2 ? 'Tinggi (auto)' : 'Tinggi'}
            suffix="cm"
            value={tinggi}
            onChange={setTinggi}
            disabled={method === 2}
            inputMode="decimal"
          />
        </div>
      </section>

      {/* Step 3 — item & harga */}
      <section className="space-y-3">
        <StepTitle no="3">Nama item &amp; harga</StepTitle>
        <div>
          <label className="text-xs text-brand-500 mb-1.5 block font-medium">Nama item</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder={'mis. 4" hitam ad'}
            className="w-full bg-white border border-brand-200 rounded-lg px-3 py-2.5 text-sm text-brand-900 focus:border-brand-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-brand-500 mb-1.5 block font-medium">Harga per meter</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-brand-400 font-mono pointer-events-none">
              Rp
            </span>
            <input
              type="number"
              inputMode="numeric"
              value={pricePerMeter}
              onChange={(e) => setPricePerMeter(e.target.value)}
              placeholder="0"
              className="w-full bg-white border border-brand-200 rounded-lg pl-9 pr-3 py-2.5 text-base font-mono text-brand-900 focus:border-brand-600 focus:outline-none"
            />
          </div>
          {hasPrice && (
            <div className="text-[11px] text-brand-400 mt-1 font-mono">Rp {fmtIDR(price)}/meter</div>
          )}
        </div>
      </section>

      {/* Step 4 — jumlah */}
      <section>
        <StepTitle no="4">Jumlah</StepTitle>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-11 h-11 bg-white border border-brand-200 rounded-lg text-xl text-brand-700 active:bg-brand-50"
          >
            −
          </button>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
            inputMode="numeric"
            className="flex-1 bg-white border border-brand-200 rounded-lg px-3 py-2.5 text-center font-mono text-brand-900 focus:border-brand-600 focus:outline-none"
          />
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-11 h-11 bg-white border border-brand-200 rounded-lg text-xl text-brand-700 active:bg-brand-50"
          >
            +
          </button>
          <span className="text-xs text-brand-400 ml-1">pcs</span>
        </div>
      </section>

      {/* Messages */}
      {result.msg && (
        <div
          className={`px-3 py-2.5 rounded-lg text-xs border ${
            result.msgType === 'error'
              ? 'bg-red-50 border-red-200 text-red-700'
              : result.msgType === 'info'
              ? 'bg-brand-100 border-brand-300 text-brand-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          {result.msg}
        </div>
      )}

      {/* Breakdown */}
      {result.ok && result.steps.length > 0 && (
        <details className="bg-brand-50 border border-brand-200 rounded-lg overflow-hidden">
          <summary className="px-3 py-2.5 text-xs text-brand-600 cursor-pointer select-none">
            Lihat breakdown perhitungan
          </summary>
          <div className="border-t border-brand-200">
            {result.steps.map((s, i) => (
              <div
                key={i}
                className="flex justify-between items-center px-3 py-2 text-xs font-mono border-b border-brand-100 last:border-0"
              >
                <span className="text-brand-500">{s.label}</span>
                <span className="text-brand-800">{s.val}</span>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Results */}
      {result.ok && (
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <ResultCard label="Per pcs" value={fmtMeterFull(result.cm)} />
            <ResultCard label={`Total (${qty} pcs)`} value={`${totalMeter.toFixed(1).replace('.', ',')} m`} />
          </div>
          <div className="bg-brand-700 rounded-xl p-4 text-white shadow-sm">
            <div className="text-xs text-brand-100 mb-1">Total harga</div>
            <div className="text-2xl font-mono font-medium">
              {hasPrice ? fmtIDRWithRp(totalPrice) : 'Isi harga per meter'}
            </div>
            {hasPrice && lebar && tinggi && (
              <div className="text-[11px] text-brand-200 mt-2 font-mono">
                {itemName.trim() || 'Item'} {fmtSize(lebar, tinggi)} : {fmtMeter(result.cm)} x {qty}pcs x {fmtIDR(price)}
              </div>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={!canAdd}
            className="w-full bg-brand-700 hover:bg-brand-800 disabled:bg-brand-200 disabled:text-brand-400 text-white font-medium py-3 rounded-xl transition shadow-sm"
          >
            + Tambahkan ke Quotation
          </button>
          {!canAdd && (
            <div className="text-[11px] text-brand-400 text-center">
              {itemName.trim() === '' ? 'Isi nama item dulu' : !hasPrice ? 'Isi harga per meter dulu' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function StepTitle({ no, children }) {
  return (
    <h2 className="text-base font-bold text-brand-900 mb-3">
      <span className="text-brand-700">{no}.</span> {children}
    </h2>
  )
}

function InputField({ label, suffix, value, onChange, disabled, inputMode }) {
  return (
    <div>
      <label className="text-xs text-brand-500 mb-1.5 block font-medium">{label}</label>
      <div className="relative">
        <input
          type="number"
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="0"
          className="w-full bg-white border border-brand-200 rounded-lg px-3 py-2.5 pr-10 text-base font-mono text-brand-900 focus:border-brand-600 focus:outline-none disabled:opacity-60 disabled:bg-brand-50"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-400 font-mono pointer-events-none">
          {suffix}
        </span>
      </div>
    </div>
  )
}

function ResultCard({ label, value }) {
  return (
    <div className="bg-brand-50 border border-brand-200 rounded-lg p-3">
      <div className="text-[11px] text-brand-500 mb-0.5">{label}</div>
      <div className="text-lg font-mono font-medium text-brand-900">{value}</div>
    </div>
  )
}
