import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const COLORS = ['#f87171', '#fb923c', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa']

export default function ExpenseChart({ transactions }) {
  const expenses = transactions.filter(t => t.type === 'expense')

  const data = Object.entries(
    expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  if (data.length === 0) {
    return <p>Ingen utgifter å vise enda.</p>
  }

  return (
    <PieChart width={320} height={280}>
      <Pie data={data} cx="50%" cy="50%" outerRadius={100} dataKey="value">
        {data.map((_, i) => (
          <Cell key={i} fill={COLORS[i % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip formatter={(v) => `${v} kr`} />
      <Legend />
    </PieChart>
  )
}