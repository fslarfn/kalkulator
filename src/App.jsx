import { useState } from 'react'
import Calculator from './components/Calculator'
import Quotation from './components/Quotation'
import History from './components/History'
import Guide from './components/Guide'
import { Logo } from './components/Shapes'
import { useLocalStorage } from './lib/useLocalStorage'
import { calcItemPrice } from './lib/format'

export default function App() {
  const [tab, setTab] = useState('calc')
  const [items, setItems] = useLocalStorage('toto.quotation', [])
  const [history, setHistory] = useLocalStorage('toto.history', [])

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
    <div className="min-h-screen bg-brand-50 flex flex-col">
      {/* Header */}
      <header className="safe-top bg-white border-b border-brand-200 sticky top-0 z-10 shadow-sm">
        <div className="px-4 py-3 flex items-center gap-2.5 max-w-md mx-auto w-full">
          <Logo className="w-9 h-9" />
          <div>
            <h1 className="text-sm font-bold text-brand-900 leading-tight">
              Toto Aluminium Manufacture
            </h1>
            <p className="text-[10px] text-brand-500 tracking-wide">Kalkulator Bending</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-4 max-w-md mx-auto w-full pb-28">
        {tab === 'calc' && (
          <>
            <Calculator onAddToQuotation={handleAddItem} />
            <Guide />
          </>
        )}
        {tab === 'quotation' && (
          <Quotation items={items} setItems={setItems} onClear={handleClearQuotation} />
        )}
        {tab === 'history' && (
          <History history={history} setHistory={setHistory} onRestore={handleRestore} />
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-200 safe-bottom z-10 no-print shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-3 max-w-md mx-auto">
          <NavBtn active={tab === 'calc'} onClick={() => setTab('calc')} icon={IconCalc} label="Hitung" />
          <NavBtn
            active={tab === 'quotation'}
            onClick={() => setTab('quotation')}
            icon={IconQuote}
            label="Quotation"
            badge={items.length}
          />
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
        active ? 'text-brand-700' : 'text-brand-400'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-[10px] font-medium">{label}</span>
      {badge > 0 && (
        <span className="absolute top-1 right-1/4 bg-brand-700 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
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
const IconHistory = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
)
