import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import TransactionForm from '../components/TransactionForm'
import SummaryCard from '../components/SummaryCard'
import ExpenseChart from '../components/ExpenseChart'

export default function Dashboard() {
  const [transactions, setTransactions] = useState([])
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    let cancelled = false

    supabase
      .from('transactions')
      .select('*')
      .gte('date', `${month}-01`)
      .lte('date', `${month}-31`)
      .order('date', { ascending: false })
      .then(({ data }) => {
        if (!cancelled) setTransactions(data || [])
      })

    return () => { cancelled = true }
  }, [month, refresh])

  const handleAdded = useCallback(() => setRefresh(r => r + 1), [])

  return (
    <div className="dashboard">
      <div className="top-row">
        <h1>Budsjett</h1>
        <input type="month" value={month} onChange={e => setMonth(e.target.value)} />
      </div>
      <SummaryCard transactions={transactions} />
      <TransactionForm onAdded={handleAdded} />
      <ExpenseChart transactions={transactions} />
    </div>
  )
}