import { useState, useEffect } from 'react'
import Calculator from './components/Calculator'
import Products from './components/Products'
import Quotation from './components/Quotation'
import History from './components/History'
import { useLocalStorage } from './lib/useLocalStorage'
import { calcItemPrice } from './lib/format'

const DEFAULT_PRODUCTS = [
  { id: 'p1', name: '4" hitam ad', price: 230000 },
  { id: 'p2', name: 'Ornamen', price: 60000 }
]

export default function App() {
  const [tab, setTab] = useState('calc')
  const [products, setProducts] = useLocalStorage('toto.products', DEFAULT_PRODUCTS)
  const [items, setItems] = useLocalStorage('toto.quotation', [])
  const [history, setHistory] = useLocalStorage('toto.history', [])

  // Auto-save ke history setiap kali quotation di-share/copy (deteksi via flag)
  // Tapi simpler: simpan via tombol manual atau saat kosongkan
  const archiveAndClear = (customer) => {
    if (items.length > 0) {
      const total = items.reduce((sum, it) => sum + calcItemPrice(it), 0)
      setHistory([
        ...history,
        {
          id: 'h' + Date.now(),
          timestamp: Date.now(),
          customer: customer || '',
          items: items.map((i) => ({ ...i })),
          total
        }
      ])
    }
    setItems([])
  }

  const handleAddItem = (item) => {
    setItems([...items, item])
    setTab('quotation')
  }

  const handleRestore = (h) => {
    if (items.length > 0 && !confirm('Quotation saat ini akan diganti. Lanjutkan?')) return
    setItems(h.items.map((i, idx) => ({ ...i, id: 'q' + Date.now() + idx })))
    setTab('quotation')
  }

  const handleClearQuotation = () => {
    if (items.length === 0) return
    const total = items.reduce((sum, it) => sum + calcItemPrice(it), 0)
    setHistory([
      ...history,
      {
        id: 'h' + Date.now(),
        timestamp: Date.now(),
        customer: '',
        items: items.map((i) => ({ ...i })),
        total
      }
    ])
    setItems([])
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="safe-top bg-slate-900/95 backdrop-blur border-b border-slate-800 sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between max-w-md mx-auto w-full">
          <div>
            <h1 className="text-base font-semibold text-amber-200">Toto Bending</h1>
            <p className="text-[10px] text-slate-500">Kalkulator aluminium</p>
          </div>
          {items.length > 0 && (
            <button
              onClick={() => setTab('quotation')}
              className="bg-amber-500/20 border border-amber-500/40 text-amber-200 px-3 py-1 rounded-full text-xs font-medium"
            >
              {items.length} item
            </button>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-4 max-w-md mx-auto w-full pb-24">
        {tab === 'calc' && <Calculator products={products} onAddToQuotation={handleAddItem} />}
        {tab === 'products' && <Products products={products} setProducts={setProducts} />}
        {tab === 'quotation' && (
          <Quotation items={items} setItems={setItems} onClear={handleClearQuotation} />
        )}
        {tab === 'history' && (
          <History history={history} setHistory={setHistory} onRestore={handleRestore} />
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 safe-bottom z-10 no-print">
        <div className="grid grid-cols-4 max-w-md mx-auto">
          <NavBtn active={tab === 'calc'} onClick={() => setTab('calc')} icon={IconCalc} label="Hitung" />
          <NavBtn
            active={tab === 'quotation'}
            onClick={() => setTab('quotation')}
            icon={IconQuote}
            label="Quotation"
            badge={items.length}
          />
          <NavBtn active={tab === 'products'} onClick={() => setTab('products')} icon={IconBox} label="Produk" />
          <NavBtn active={tab === 'history'} onClick={() => setTab('history')} icon={IconHistory} label="History" />
        </div>
      </nav>
    </div>
  )
}

function NavBtn({ active, onClick, icon: Icon, label, badge }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 py-2.5 transition relative ${
        active ? 'text-amber-300' : 'text-slate-500'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-[10px] font-medium">{label}</span>
      {badge > 0 && (
        <span className="absolute top-1 right-1/4 bg-amber-500 text-slate-900 text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
          {badge}
        </span>
      )}
    </button>
  )
}

// Icons (inline SVG)
const IconCalc = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="11" x2="8" y2="11" />
    <line x1="12" y1="11" x2="12" y2="11" />
    <line x1="16" y1="11" x2="16" y2="11" />
    <line x1="8" y1="15" x2="8" y2="15" />
    <line x1="12" y1="15" x2="12" y2="15" />
    <line x1="16" y1="15" x2="16" y2="15" />
    <line x1="8" y1="19" x2="16" y2="19" />
  </svg>
)
const IconQuote = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="15" y2="17" />
  </svg>
)
const IconBox = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
)
const IconHistory = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
)
