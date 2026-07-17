import { useState } from 'react'
import Calculator from './components/Calculator'
import Quotation from './components/Quotation'
import History from './components/History'
import Guide from './components/Guide'
import { Logo } from './components/Shapes'
import { useLocalStorage } from './lib/useLocalStorage'
import { calcItemPrice } from './lib/format'

// Nomor WhatsApp tim Toto Aluminium (format internasional tanpa +).
// Ganti dengan nomor asli; jika dikosongkan, tombol membuka WhatsApp tanpa kontak terpilih.
const WA_NUMBER = ''

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

  const waLink = `https://wa.me/${WA_NUMBER}`

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col">
      {/* Header */}
      <header className="safe-top bg-white border-b border-brand-200 sticky top-0 z-10 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between max-w-md mx-auto w-full">
          <div className="flex items-center gap-2.5">
            <Logo className="w-9 h-9" />
            <div>
              <h1 className="text-sm font-bold text-brand-900 leading-tight">
                Toto Aluminium Manufacture
              </h1>
              <p className="text-[10px] text-brand-500 tracking-wide">Kalkulator Bending</p>
            </div>
          </div>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-xl bg-wa flex items-center justify-center shadow-sm"
            aria-label="Hubungi via WhatsApp"
          >
            <WhatsAppIcon className="w-5 h-5 text-white" />
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-4 max-w-md mx-auto w-full pb-28">
        {tab === 'calc' && (
          <>
            <Calculator onAddToQuotation={handleAddItem} />
            <Guide waNumber={WA_NUMBER} />
          </>
        )}
        {tab === 'quotation' && (
          <Quotation items={items} setItems={setItems} onClear={handleClearQuotation} />
        )}
        {tab === 'history' && (
          <History history={history} setHistory={setHistory} onRestore={handleRestore} />
        )}
      </main>

      {/* Floating WhatsApp */}
      <a
        href={waLink}
        target="_blank"
        rel="noreferrer"
        className="fixed right-4 bottom-[76px] z-20 w-14 h-14 rounded-full bg-wa flex items-center justify-center shadow-lg no-print"
        aria-label="Hubungi via WhatsApp"
      >
        <WhatsAppIcon className="w-7 h-7 text-white" />
      </a>

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
const WhatsAppIcon = (p) => (
  <svg {...p} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
)
