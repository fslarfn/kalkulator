import { fmtIDRWithRp } from '../lib/format'

export default function History({ history, setHistory, onRestore }) {
  const handleDelete = (id) => {
    if (!confirm('Hapus dari history?')) return
    setHistory(history.filter((h) => h.id !== id))
  }

  const handleClear = () => {
    if (!confirm('Hapus seluruh history?')) return
    setHistory([])
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-base text-slate-300 mb-2">Belum ada history</div>
        <div className="text-xs text-slate-500">
          Quotation yang sudah dikirim akan tersimpan otomatis di sini
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-medium">History quotation</h2>
        <button onClick={handleClear} className="text-xs text-red-400 hover:text-red-300">
          Hapus semua
        </button>
      </div>
      <div className="space-y-2">
        {[...history].reverse().map((h) => (
          <div key={h.id} className="bg-slate-800/40 border border-slate-700 rounded-lg p-3">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {h.customer || '— tanpa nama —'}
                </div>
                <div className="text-[11px] text-slate-500">
                  {new Date(h.timestamp).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}{' '}
                  · {h.items.length} item
                </div>
              </div>
              <button
                onClick={() => handleDelete(h.id)}
                className="text-slate-500 hover:text-red-400 text-xs px-2 py-1"
              >
                ✕
              </button>
            </div>
            <div className="font-mono text-sm text-amber-300 mb-2">
              {fmtIDRWithRp(h.total)}
            </div>
            <button
              onClick={() => onRestore(h)}
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-100 py-1.5 rounded-md text-xs"
            >
              Muat ulang ke quotation
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
