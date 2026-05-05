import { useState } from 'react'

export default function Products({ products, setProducts }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editPrice, setEditPrice] = useState('')

  const handleAdd = () => {
    const trimmedName = name.trim()
    const numPrice = parseFloat(price)
    if (!trimmedName || isNaN(numPrice) || numPrice <= 0) return
    setProducts([...products, { id: 'p' + Date.now(), name: trimmedName, price: numPrice }])
    setName('')
    setPrice('')
  }

  const handleDelete = (id) => {
    if (!confirm('Hapus produk ini?')) return
    setProducts(products.filter((p) => p.id !== id))
  }

  const startEdit = (product) => {
    setEditingId(product.id)
    setEditName(product.name)
    setEditPrice(product.price.toString())
  }

  const saveEdit = () => {
    const trimmedName = editName.trim()
    const numPrice = parseFloat(editPrice)
    if (!trimmedName || isNaN(numPrice) || numPrice <= 0) return
    setProducts(products.map((p) => (p.id === editingId ? { ...p, name: trimmedName, price: numPrice } : p)))
    setEditingId(null)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-medium mb-1">Daftar produk</h2>
        <p className="text-xs text-slate-400">Tersimpan permanen di device ini.</p>
      </div>

      {/* Add form */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-3 space-y-2">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Nama produk</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Contoh: 4" hitam ad'
            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Harga per meter</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">Rp</span>
            <input
              type="number"
              inputMode="numeric"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="230000"
              className="w-full bg-slate-900 border border-slate-700 rounded-md pl-9 pr-3 py-2 text-sm font-mono focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-medium py-2 rounded-md text-sm"
        >
          + Tambah produk
        </button>
      </div>

      {/* List */}
      {products.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">Belum ada produk</div>
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p.id} className="bg-slate-800/40 border border-slate-700 rounded-lg p-3">
              {editingId === p.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
                  />
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm font-mono focus:border-amber-500 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="flex-1 bg-amber-500 text-slate-900 font-medium py-1.5 rounded-md text-xs"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 bg-slate-700 text-slate-200 py-1.5 rounded-md text-xs"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{p.name}</div>
                    <div className="text-xs text-slate-400 font-mono">
                      Rp {p.price.toLocaleString('id-ID')} / m
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEdit(p)}
                      className="px-2.5 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-2.5 py-1.5 text-xs bg-red-900/40 hover:bg-red-900/60 text-red-200 rounded-md"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
