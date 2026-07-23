import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Sparkline from './Sparkline'
import { fmt } from '../lib/api'

export default function IndexCard({ data, route, code }) {
    if (!data) return null
    const positive = data.daily_change >= 0
    const colorClass = positive ? 'text-[#00E676]' : 'text-[#FF3B30]'
    const Arrow = positive ? ArrowUpRight : ArrowDownRight

    return (
        <Link to={route} className="group block border border-[#24242A] bg-[#0F0F11] hover:border-[#EDEDED] transition-colors duration-150 rise">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#24242A]">
                <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-[#55555F] uppercase tracking-[0.2em]">{code}</span>
                    <span className="font-display font-bold text-lg tracking-tight">{data.display_name}</span>
                </div>
                <span className="font-mono text-[10px] text-[#55555F] uppercase tracking-wider">{fmt.date(data.last_updated)}</span>
            </div>

            <div className="grid grid-cols-5 gap-6 px-5 py-6">
                <div className="col-span-3 flex flex-col justify-center">
                    <div className="font-mono tabular-nums text-4xl sm:text-5xl font-medium text-[#EDEDED] leading-none tracking-tight">{fmt.price(data.current_price)}</div>
                    <div className={`mt-3 flex items-center gap-3 font-mono text-sm tabular-nums ${colorClass}`}>
                        <Arrow className="w-4 h-4" strokeWidth={2} />
                        <span>{fmt.signed(data.daily_change)}</span>
                        <span className="text-[#55555F]">·</span>
                        <span>{fmt.pct(data.daily_change_percent)}</span>
                    </div>
                </div>
                <div className="col-span-2 flex items-center">
                    <div className="w-full">
                        <Sparkline data={data.sparkline} positive={positive} height={72} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 border-t border-[#24242A]">
                <div className="px-5 py-3 border-r border-[#24242A]">
                    <div className="font-mono text-[10px] text-[#55555F] uppercase tracking-widest">52W HIGH</div>
                    <div className="font-mono tabular-nums text-sm text-[#00E676] mt-1">{fmt.price(data.week52_high)}</div>
                </div>
                <div className="px-5 py-3">
                    <div className="font-mono text-[10px] text-[#55555F] uppercase tracking-widest">52W LOW</div>
                    <div className="font-mono tabular-nums text-sm text-[#FF3B30] mt-1">{fmt.price(data.week52_low)}</div>
                </div>
            </div>

            <div className="px-5 py-3 border-t border-[#24242A] flex items-center justify-between opacity-70 group-hover:opacity-100 transition-opacity duration-150">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#55555F]">Open detailed view</span>
                <ArrowUpRight className="w-4 h-4 text-[#EDEDED]" strokeWidth={1.5} />
            </div>
        </Link>
    )
}
