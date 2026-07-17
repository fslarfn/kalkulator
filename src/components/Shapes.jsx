// Diagram bentuk lengkungan untuk tiap metode bending.
// type: 1 = kurang dari ½ (dangkal), 2 = setengah lingkaran pas, 3 = lebih dari ½ (arch)

const PATHS = {
  1: 'M14,44 Q50,26 86,44',
  2: 'M18,44 A32,32 0 0 1 82,44',
  3: 'M30,44 L30,26 A20,20 0 0 1 70,26 L70,44'
}

export function ArchIcon({ type, className, active }) {
  const stroke = active ? '#6f4a29' : '#a67844'
  return (
    <svg viewBox="0 0 100 56" className={className} fill="none" aria-hidden="true">
      <path
        d={PATHS[type]}
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="12"
        y1="44"
        x2="88"
        y2="44"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="2 6"
      />
    </svg>
  )
}

// Logo mark sederhana bergaya arch/segitiga untuk header
export function Logo({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
      <path
        d="M24 5 L41 40 H31 L24 24 L17 40 H7 Z"
        stroke="#6f4a29"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M24 15 L33 34 H27 L24 27 L21 34 H15 Z"
        stroke="#a67844"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}
