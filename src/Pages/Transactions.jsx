const sample = [
  { id: 1, description: 'Lønn', amount: 32000, type: 'income', category: 'Inntekt', date: '2026-05-01' },
  { id: 2, description: 'Leie', amount: 9000, type: 'expense', category: 'Husleie', date: '2026-05-03' },
  { id: 3, description: 'Mat', amount: 4200, type: 'expense', category: 'Mat', date: '2026-05-05' },
]

const money = new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 })

export default function Transactions() {
  return (
    <main className="dashboard-page">
      <header className="hero-card">
        <p className="eyebrow">Budsjett-app</p>
        <h1>Transaksjonsoversikt</h1>
        <p className="lede">Her kan du se de siste registrerte inntektene og utgiftene.</p>
      </header>
      <section className="panel-card">
        <ul className="transaction-list">{sample.map((item) => <li key={item.id} className={item.type === 'income' ? 'income' : 'expense'}><div><strong>{item.description}</strong><p>{item.category} • {item.date}</p></div><span className="amount">{item.type === 'income' ? '+' : '-'}{money.format(item.amount)}</span></li>)}</ul>
      </section>
    </main>
  )
}
