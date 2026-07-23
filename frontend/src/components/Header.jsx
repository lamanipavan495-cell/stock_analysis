import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Activity, Terminal } from 'lucide-react'

export default function Header({ marketStatus = 'CLOSED' }) {
    const loc = useLocation()
    const isDash = loc.pathname === '/'
    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })

    return (
        <header className="sticky top-0 z-40 border-b border-[#24242A] bg-[#050505]/95 backdrop-blur-sm">
            <div className="mx-auto max-w-[1400px] px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 border border-[#24242A] flex items-center justify-center bg-[#0F0F11] group-hover:border-[#EDEDED] transition-colors duration-150">
                        <Terminal className="w-4 h-4 text-[#00E676]" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="font-display font-bold text-base tracking-tight">DALAL/TERMINAL</span>
                        <span className="font-mono text-[10px] text-[#55555F] uppercase tracking-[0.15em] mt-1">NSE · BSE · v1.0</span>
                    </div>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/" className={`font-mono text-xs uppercase tracking-widest ${isDash ? 'text-[#EDEDED]' : 'text-[#55555F] hover:text-[#EDEDED]'}`}>
                        <span className="text-[#00E676] mr-2">01</span>DASHBOARD
                    </Link>
                    <Link to="/nifty" className={`font-mono text-xs uppercase tracking-widest ${loc.pathname === '/nifty' ? 'text-[#EDEDED]' : 'text-[#55555F] hover:text-[#EDEDED]'}`}>
                        <span className="text-[#00E676] mr-2">02</span>NIFTY 50
                    </Link>
                    <Link to="/sensex" className={`font-mono text-xs uppercase tracking-widest ${loc.pathname === '/sensex' ? 'text-[#EDEDED]' : 'text-[#55555F] hover:text-[#EDEDED]'}`}>
                        <span className="text-[#00E676] mr-2">03</span>SENSEX
                    </Link>
                </nav>

                <div className="flex items-center gap-5 font-mono text-xs uppercase tracking-wider">
                    <div className="hidden sm:flex items-center gap-2 text-[#8B8B9E]">
                        <Activity className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span>{timeStr} IST</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`pulse-dot ${marketStatus === 'CLOSED' ? 'closed' : ''}`}></span>
                        <span className={marketStatus === 'OPEN' ? 'text-[#00E676]' : 'text-[#FF3B30]'}>MKT {marketStatus}</span>
                    </div>
                </div>
            </div>
        </header>
    )
}
