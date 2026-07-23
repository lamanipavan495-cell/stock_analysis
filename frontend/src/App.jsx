import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './styles.css'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import DetailPage from './pages/DetailPage'

const queryClient = new QueryClient()

function Shell() {
    const [status, setStatus] = useState('CLOSED')
    return (
        <div className="min-h-screen bg-[#050505] text-[#EDEDED] terminal-grid scanlines">
            <Header marketStatus={status} />
            <Routes>
                <Route path="/" element={<Dashboard onStatus={setStatus} />} />
                <Route path="/nifty" element={<DetailPage indexName="NIFTY50" />} />
                <Route path="/sensex" element={<DetailPage indexName="SENSEX" />} />
            </Routes>
        </div>
    )
}

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Shell />
            </BrowserRouter>
        </QueryClientProvider>
    )
}
