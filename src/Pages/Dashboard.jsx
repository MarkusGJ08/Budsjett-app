import { useMemo, useState } from 'react'

const starterTransactions = [
  { id: 1, type: 'income', description: 'Lønn', amount: 32000, category: 'Inntekt', date: '2026-05-01' },
  { id: 2, type: 'expense', description: 'Leie', amount: 9000, category: 'Husleie', date: '2026-05-03' },
  { id: 3, type: 'expense', description: 'Mat', amount: 4200, category: 'Mat', date: '2026-05-05' },
  { id: 4, type: 'income', description: 'Sidejobb', amount: 4500, category: 'Ekstra', date: '2026-05-10' },
]

const money = new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 })

export default function Dashboard() {
  const [month, setMonth] = useState('2026-05')
  const [goal, setGoal] = useState(20000)
  const [transactions, setTransactions] = useState(starterTransactions)
  const [form, setForm] = useState({ type: 'expense', description: '', amount: '', category: '', date: '2026-05-15' })

  const filtered = useMemo(() => transactions.filter((item) => item.date.startsWith(month)), [month, transactions])

  const totals = useMemo(() => {
    const income = filtered.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0)
    const expense = filtered.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0)
    const balance = income - expense
    const progress = goal > 0 ? Math.min((balance / goal) * 100, 100) : 0
    const byCategory = filtered.filter((item) => item.type === 'expense').reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount
      return acc
    }, {})

    return { income, expense, balance, progress, byCategory }
  }, [filtered, goal])

  const addTransaction = (event) => {
    event.preventDefault()
    if (!form.description.trim() || !form.amount) return

    setTransactions((current) => [{
      id: Date.now(),
      type: form.type,
      description: form.description.trim(),
      amount: Number(form.amount),
      category: form.category.trim() || 'Annet',
      date: form.date,
    }, ...current])

    setForm((current) => ({ ...current, description: '', amount: '', category: '' }))
  }

  return (
    <main className="dashboard-page">
      <header className="hero-card">
        <p className="eyebrow">Budsjett-app</p>
        <h1>Din månedlige økonomi</h1>
        <p className="lede">Legg inn egne inntekter og utgifter, sett et sparemål og følg med på måneden.</p>
      </header>

      <section className="summary-grid">
        <article className="mini-card accent"><span>Inntekter</span><strong>{money.format(totals.income)}</strong><small>Totalt denne måneden</small></article>
        <article className="mini-card warning"><span>Utgifter</span><strong>{money.format(totals.expense)}</strong><small>Alle kostnader registrert</small></article>
        <article className="mini-card neutral"><span>Saldo</span><strong>{money.format(totals.balance)}</strong><small>{totals.balance >= 0 ? 'Du har overskudd' : 'Du er under budsjettet'}</small></article>
      </section>

      <section className="content-grid">
        <article className="panel-card">
          <h2>Legg til inntekt eller utgift</h2>
          <form className="transaction-form" onSubmit={addTransaction}>
            <label>Type<select value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}><option value="income">Inntekt</option><option value="expense">Utgift</option></select></label>
            <label>Beskrivelse<input value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="F.eks. Mat eller Lønn" /></label>
            <label>Beløp<input type="number" min="0" value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} placeholder="0" /></label>
            <label>Kategori<input value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} placeholder="Egendefinert kategori" /></label>
            <label>Dato<input type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} /></label>
            <button type="submit">Legg til</button>
          </form>
        </article>

        <article className="panel-card">
          <h2>Sparemål</h2>
          <label className="goal-input">Målbeløp<input type="number" min="0" value={goal} onChange={(event) => setGoal(Number(event.target.value) || 0)} /></label>
          <div className="progress-wrap">
            <div className="progress-labels"><strong>Framgang</strong><span>{Math.round(totals.progress)}%</span></div>
            <div className="progress-bar"><span style={{ width: `${totals.progress}%` }} /></div>
            <p className="goal-note">Du har spart {money.format(Math.max(totals.balance, 0))} av {money.format(goal)}.</p>
          </div>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel-card">
          <h2>Månedlig oversikt</h2>
          <label className="month-picker">Velg måned<input type="month" value={month} onChange={(event) => setMonth(event.target.value)} /></label>
          <div className="overview-grid">
            <div className="stat-box"><span>Inntekter</span><strong>{money.format(totals.income)}</strong></div>
            <div className="stat-box"><span>Utgifter</span><strong>{money.format(totals.expense)}</strong></div>
            <div className="stat-box"><span>Saldo</span><strong>{money.format(totals.balance)}</strong></div>
          </div>
          <div className="category-list">{Object.entries(totals.byCategory).length ? Object.entries(totals.byCategory).sort((a, b) => b[1] - a[1]).map(([category, amount]) => <div key={category} className="category-row"><span>{category}</span><strong>{money.format(amount)}</strong></div>) : <p className="empty-state">Ingen utgifter er registrert i denne måneden.</p>}</div>
        </article>

        <article className="panel-card">
          <h2>Transaksjoner</h2>
          <ul className="transaction-list">{filtered.map((item) => <li key={item.id} className={item.type === 'income' ? 'income' : 'expense'}><div><strong>{item.description}</strong><p>{item.category} • {item.date}</p></div><span className="amount">{item.type === 'income' ? '+' : '-'}{money.format(item.amount)}</span></li>)}</ul>
        </article>
      </section>
    </main>
  )
}
