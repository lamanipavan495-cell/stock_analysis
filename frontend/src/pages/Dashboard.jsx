import React from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import IndexCard from '../components/IndexCard'
import { API_BASE, fmt } from '../lib/api'
import { TrendingUp } from 'lucide-react'

const fetchDashboard = async () => {
    const { data } = await axios.get(`${API_BASE}/dashboard`)
    // backend returns array of summaries; transform into object for nifty/sensex
    const map = {}
    data.forEach((d) => {
        const key = d.index_name === 'NIFTY50' ? 'nifty' : 'sensex'
        map[key] = d
    })
    return map
}

export default function Dashboard({ onStatus }) {
    const { data, isLoading, error } = useQuery({ queryKey: ['dashboard'], queryFn: fetchDashboard })

    if (isLoading) return <LoadingState />
    if (error || !data) return <ErrorState msg={error?.message} />

    // prepare IndexCard-friendly payloads from backend summary
    const makeCard = (summary, displayName) => {
        if (!summary) return null
        const last = summary.chart && summary.chart.length ? summary.chart[summary.chart.length - 1] : null
        const lastUpdated = last ? new Date(last.time * 1000).toISOString() : null
        return {
            index_name: summary.index_name,
            display_name: displayName,
            last_updated: lastUpdated,
            current_price: summary.current_price,
            daily_change: summary.todays_change,
            daily_change_percent: summary.todays_change_percent,
            sparkline: summary.chart ? summary.chart.map((c) => c.close) : [],
            week52_high: summary.fifty_two_week_high,
            week52_low: summary.fifty_two_week_low,
        }
    }

    const niftyCard = makeCard(data.nifty, 'NIFTY 50')
    const sensexCard = makeCard(data.sensex, 'SENSEX')

    const tickers = [
        { name: 'NIFTY 50', price: niftyCard?.current_price, pct: niftyCard?.daily_change_percent },
        { name: 'SENSEX', price: sensexCard?.current_price, pct: sensexCard?.daily_change_percent },
    ]

    return (
        <div data-testid="dashboard-page">
            <div className="border-b border-[#24242A] bg-[#0F0F11] overflow-hidden">
                <div className="marquee-track py-2">
                    {[...Array(6)].map((_, ri) => (
                        <div key={ri} className="flex items-center gap-10 pr-10">
                            {tickers.map((t) => (
                                <div key={`${ri}-${t.name}`} className="flex items-center gap-3 font-mono text-xs">
                                    <span className="text-[#55555F] tracking-widest">{t.name}</span>
                                    <span className="text-[#EDEDED] tabular-nums">{fmt.price(t.price)}</span>
                                    <span className={t.pct >= 0 ? 'text-[#00E676]' : 'text-[#FF3B30]'}>{fmt.pct(t.pct)}</span>
                                    <span className="text-[#24242A]">|</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mx-auto max-w-[1400px] px-6 py-12">
                <div className="mb-14 rise">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="font-mono text-[10px] text-[#00E676] uppercase tracking-[0.3em]">// SESSION 01</span>
                        <div className="h-px bg-[#24242A] flex-1 max-w-[240px]"></div>
                    </div>
                    <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tighter text-[#EDEDED] max-w-3xl leading-[0.95]">Indian markets, at a glance.</h1>
                    <p className="mt-5 text-[#8B8B9E] text-base max-w-xl leading-relaxed">Real historical OHLCV for NIFTY 50 &amp; SENSEX — priced, plotted, and dissected in a single trading terminal.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" data-testid="index-cards-grid">
                    {niftyCard && <IndexCard data={niftyCard} route="/nifty" code="IN.NSE" />}
                    {sensexCard && <IndexCard data={sensexCard} route="/sensex" code="IN.BSE" />}
                </div>

                <div className="mt-14 border-t border-[#24242A] pt-6 flex items-center justify-between text-[#55555F] font-mono text-[10px] uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-3 h-3" strokeWidth={1.5} />
                        <span>Historical daily OHLCV · 1Y window</span>
                    </div>
                    <span>Data via Yahoo Finance</span>
                </div>
            </div>
        </div>
    )
}

function LoadingState() {
    return (
        <div className="mx-auto max-w-[1400px] px-6 py-24" data-testid="dashboard-loading">
            <div className="font-mono text-xs text-[#55555F] uppercase tracking-widest animate-pulse">&gt; Loading market data...</div>
        </div>
    )
}

function ErrorState({ msg }) {
    return (
        <div className="mx-auto max-w-[1400px] px-6 py-24" data-testid="dashboard-error">
            <div className="border border-[#FF3B30]/40 bg-[#FF3B30]/5 p-6">
                <div className="font-mono text-xs text-[#FF3B30] uppercase tracking-widest mb-2">! ERROR</div>
                <div className="text-[#EDEDED]">Unable to load market data.</div>
                {msg && <div className="text-[#8B8B9E] text-sm mt-2 font-mono">{msg}</div>}
            </div>
        </div>
    )
}
