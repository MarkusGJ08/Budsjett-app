import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import TransactionList from '../components/TransactionList'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    let cancelled = false

    supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
      .then(({ data }) => {
        if (!cancelled) setTransactions(data || [])
      })

    return () => { cancelled = true }
  }, [refresh])

  return (
  <div className="dashboard">
    <h2>Alle transaksjoner</h2>
    <TransactionList
      transactions={transactions}
      onDeleted={() => setRefresh(r => r + 1)}
    />
  </div>
)
}