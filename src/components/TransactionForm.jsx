import { useState } from 'react'
import { supabase } from '../lib/supabase'

const DEFAULT_CATEGORIES = ['Mat', 'Klær', 'Transport', 'Fritid', 'Bolig', 'Annet']

export default function TransactionForm({ onAdded }) {
  const initialCategories = (() => {
    try {
      const saved = localStorage.getItem('budget_categories')
      if (saved) {
        const arr = JSON.parse(saved)
        if (Array.isArray(arr) && arr.length) return arr
      }
    } catch (err) {
      console.warn('Could not read budget_categories from localStorage', err)
    }
    return DEFAULT_CATEGORIES
  })()

  const [categories, setCategories] = useState(initialCategories)
  const [form, setForm] = useState({
    description: '', amount: '', type: 'expense', category: initialCategories[0], date: ''
  })
  const [newCategory, setNewCategory] = useState('')
  const [submitError, setSubmitError] = useState('')

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleAddCategory = () => {
    const category = newCategory.trim()
    if (!category) return
    if (!categories.includes(category)) {
      const newCats = [category, ...categories]
      setCategories(newCats)
      try {
        localStorage.setItem('budget_categories', JSON.stringify(newCats))
      } catch (err) {
        console.warn('Could not save budget_categories to localStorage', err)
      }
    }
    setForm({ ...form, category })
    setNewCategory('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    const { error } = await supabase.from('transactions').insert([{
      ...form,
      amount: parseFloat(form.amount)
    }])
    if (!error) {
      setForm({ description: '', amount: '', type: 'expense', category: categories[0] || DEFAULT_CATEGORIES[0], date: '' })
      onAdded()
    } else {
      setSubmitError('Kunne ikke legge til transaksjonen. Sjekk nettverk eller prøv igjen.')
    }
  }

  

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <input name="description" placeholder="Beskrivelse" value={form.description} onChange={handleChange} required />
      <input name="amount" type="number" placeholder="Beløp (kr)" value={form.amount} onChange={handleChange} required />
      <select name="type" value={form.type} onChange={handleChange}>
        <option value="income">Inntekt</option>
        <option value="expense">Utgift</option>
      </select>
      <div className="category-select">
        <select name="category" value={form.category} onChange={handleChange}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="new-category-row">
          <input
            type="text"
            placeholder="Ny kategori"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
          />
          <button type="button" onClick={handleAddCategory}>+</button>
        </div>
      </div>
      <input name="date" type="date" value={form.date} onChange={handleChange} required />
      <button type="submit">Legg til</button>
      {submitError && <div className="error-text">{submitError}</div>}
    </form>
  )
}