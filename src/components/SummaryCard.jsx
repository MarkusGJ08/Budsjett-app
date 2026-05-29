export default function SummaryCard({ transactions }) {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = income - expenses

  return (
    <div className="summary">
      <div className="card income">
        <div className="label">Inntekter</div>
        <div className="amount">+{income} kr</div>
      </div>
      <div className="card expense">
        <div className="label">Utgifter</div>
        <div className="amount">-{expenses} kr</div>
      </div>
      <div className={`card balance ${balance >= 0 ? 'positive' : 'negative'}`}>
        <div className="label">Saldo</div>
        <div className="amount">{balance} kr</div>
      </div>
    </div>
  )
}