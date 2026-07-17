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
        <div className="text-base text-brand-700 mb-2">Belum ada history</div>
        <div className="text-xs text-brand-400">
          Quotation yang sudah dikirim akan tersimpan otomatis di sini
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-bold text-brand-900">History quotation</h2>
        <button onClick={handleClear} className="text-xs text-red-500 hover:text-red-600">
          Hapus semua
        </button>
      </div>
      <div className="space-y-2">
        {[...history].reverse().map((h) => (
          <div key={h.id} className="bg-white border border-brand-200 rounded-lg p-3 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-brand-900 truncate">
                  {h.customer || '— tanpa nama —'}
                </div>
                <div className="text-[11px] text-brand-400">
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
                className="text-brand-400 hover:text-red-500 text-xs px-2 py-1"
              >
                ✕
              </button>
            </div>
            <div className="font-mono text-sm text-brand-800 mb-2">
              {fmtIDRWithRp(h.total)}
            </div>
            <button
              onClick={() => onRestore(h)}
              className="w-full bg-brand-100 hover:bg-brand-200 border border-brand-200 text-brand-800 py-1.5 rounded-md text-xs"
            >
              Muat ulang ke quotation
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
