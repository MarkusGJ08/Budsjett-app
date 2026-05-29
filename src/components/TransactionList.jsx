import { supabase } from '../lib/supabase'

export default function TransactionList({ transactions, onDeleted }) {
  const handleDelete = async (id) => {
    await supabase.from('transactions').delete().eq('id', id)
    onDeleted()
  }

  return (
    <ul className="transaction-list">
      {transactions.map(t => (
        <li key={t.id} className={t.type}>
          <span className="desc">{t.description}</span>
          <span className="cat">{t.category}</span>
          <span className="date">{t.date}</span>
          <span className="amount">
            {t.type === 'income' ? '+' : '-'}{t.amount} kr
          </span>
          <button onClick={() => handleDelete(t.id)}>🗑</button>
        </li>
      ))}
    </ul>
  )
}