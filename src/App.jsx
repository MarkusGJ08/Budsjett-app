import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import './App.css'

export default function App() {
  return (
    <>
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/transactions">Transaksjoner</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </>
  )
}