const METHODS_INFO = [
  {
    no: 1,
    title: 'Kurang dari ½ lingkaran',
    lead: 'Tinggi lengkung kurang dari hasil lebar dibagi 2.',
    body: 'Contoh: lebar 100 cm, tinggi lengkungnya di bawah 50 cm — lengkungan dangkal di bagian atas kusen. Material dihitung: lebar + tinggi + 30 cm sambungan.'
  },
  {
    no: 2,
    title: 'Setengah lingkaran pas',
    lead: 'Tinggi lengkung sama dengan hasil lebar dibagi 2.',
    body: 'Contoh: lebar 100 cm, tinggi lengkungnya tepat 50 cm — setengah lingkaran sempurna. Material dihitung dari keliling busur: (lebar ÷ 2) × 3,14 + 30 cm sambungan. Khusus lebar 60–75 cm, material yang dipakai standar 1,5 m.'
  },
  {
    no: 3,
    title: 'Lebih dari ½ lingkaran',
    lead: 'Tinggi lengkung lebih dari hasil lebar dibagi 2.',
    body: 'Contoh: lebar 100 cm, tinggi lengkungnya di atas 50 cm — bentuk pintu/jendela arch dengan sisi tegak. Busur ditambah dua sisi lurus, plus 30 cm sambungan. Di atas 6 m otomatis ditambah 30 cm lagi.'
  }
]

export default function Guide({ waNumber }) {
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    'Halo Toto Aluminium, saya mau minta bantuan hitung kebutuhan material bending.'
  )}`
  return (
    <section className="mt-8">
      <div className="text-center mb-5">
        <h2 className="font-serif text-3xl font-bold text-brand-800 leading-tight">
          Cara Kerja Perhitungannya
        </h2>
        <p className="text-sm text-brand-600 mt-3 px-2">
          Kebutuhan material bending dihitung dari bentuk lengkungan yang Anda inginkan.
          Ada tiga metode sesuai bentuknya:
        </p>
      </div>

      <div className="space-y-4">
        {METHODS_INFO.map((m) => (
          <div key={m.no} className="bg-white rounded-2xl border border-brand-200 shadow-sm p-5">
            <div className="text-[11px] font-mono tracking-widest text-brand-400 mb-1">
              METODE {m.no}
            </div>
            <h3 className="text-lg font-bold text-brand-900 mb-2">{m.title}</h3>
            <p className="text-sm text-brand-700 leading-relaxed">
              <span className="font-semibold text-brand-800">{m.lead}</span> {m.body}
            </p>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-brand-600 mt-6 px-2">
        Bingung pilih metode yang mana? Kirim foto atau sketsa desain Anda ke{' '}
        <a href={waLink} target="_blank" rel="noreferrer" className="font-semibold text-brand-800 underline">
          WhatsApp
        </a>
        , tim kami bantu hitungkan gratis.
      </p>
    </section>
  )
}
