import { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { createChart } from 'lightweight-charts'

const api = axios.create({ baseURL: 'http://127.0.0.1:8000' })

const formatCurrency = (value) => `₹${Number(value).toFixed(2)}`

export default function DetailPage({ indexName }) {
  const [stats, setStats] = useState(null)
  const [history, setHistory] = useState([])
  const [chartData, setChartData] = useState([])
  const chartContainerRef = useRef(null)

  useEffect(() => {
    const endpoint = indexName === 'NIFTY50' ? '/nifty' : '/sensex'
    const statsEndpoint = indexName === 'NIFTY50' ? '/nifty/stats' : '/sensex/stats'
    const chartEndpoint = indexName === 'NIFTY50' ? '/nifty/chart' : '/sensex/chart'

    api.get(endpoint).then((res) => setHistory(res.data))
    api.get(statsEndpoint).then((res) => setStats(res.data))
    api.get(chartEndpoint).then((res) => setChartData(res.data))
  }, [indexName])

  useEffect(() => {
    if (!chartContainerRef.current || chartData.length === 0) return

    const chart = createChart(chartContainerRef.current, {
      layout: { background: { color: '#071025' }, textColor: '#e6eef6' },
      grid: { vertLines: { color: '#071827' }, horzLines: { color: '#071827' } },
      width: chartContainerRef.current.clientWidth,
      height: 420,
    })

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    })

    candlestickSeries.setData(chartData.map((item) => ({
      time: item.time,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    })))

    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: 'volume' },
      priceScaleId: '',
      color: '#38bdf8',
    })

    volumeSeries.setData(chartData.map((item) => ({ time: item.time, value: item.volume, color: item.close >= item.open ? 'rgba(34,197,94,0.5)' : 'rgba(239,68,68,0.5)' })))

    chart.timeScale().fitContent()

    return () => chart.remove()
  }, [chartData])

  const latest = useMemo(() => history[history.length - 1], [history])

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'linear-gradient(180deg,#030316 0%, #071025 100%)' }}>
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl p-6 text-white glass-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm uppercase text-[var(--muted)]">{indexName}</div>
              <div className="text-4xl font-extrabold">{latest ? formatCurrency(latest.close) : '—'}</div>
            </div>
            {stats && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl glass-card p-3">52W High: <span className="text-[var(--accent-green)]">{formatCurrency(stats.fifty_two_week_high)}</span></div>
                <div className="rounded-xl glass-card p-3">52W Low: <span className="text-[var(--accent-red)]">{formatCurrency(stats.fifty_two_week_low)}</span></div>
              </div>
            )}
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-2xl p-4 shadow-md glass-card">
            <div className="mb-3 text-lg font-semibold">Interactive Candlestick View</div>
            <div ref={chartContainerRef} className="h-[420px] w-full" />
          </div>

          <div className="rounded-2xl p-4 shadow-md glass-card">
            <div className="mb-3 text-lg font-semibold">Statistics</div>
            {stats ? (
              <div className="grid gap-3 text-sm">
                <div className="rounded-lg bg-[rgba(255,255,255,0.02)] p-3">Average Close: <span className="font-semibold">{formatCurrency(stats.avg_close)}</span></div>
                <div className="rounded-lg bg-[rgba(255,255,255,0.02)] p-3">Highest Volume: <span className="font-semibold">{stats.highest_volume.toLocaleString()}</span></div>
                <div className="rounded-lg bg-[rgba(255,255,255,0.02)] p-3">Lowest Volume: <span className="font-semibold">{stats.lowest_volume.toLocaleString()}</span></div>
                <div className="rounded-lg bg-[rgba(255,255,255,0.02)] p-3">Positive Days: <span className="font-semibold">{stats.positive_days}</span></div>
                <div className="rounded-lg bg-[rgba(255,255,255,0.02)] p-3">Negative Days: <span className="font-semibold">{stats.negative_days}</span></div>
                <div className="rounded-lg bg-[rgba(255,255,255,0.02)] p-3">7-Day MA: <span className="font-semibold">{typeof stats.moving_average_7 === 'number' ? formatCurrency(stats.moving_average_7) : '—'}</span></div>
                <div className="rounded-lg bg-[rgba(255,255,255,0.02)] p-3">30-Day MA: <span className="font-semibold">{typeof stats.moving_average_30 === 'number' ? formatCurrency(stats.moving_average_30) : '—'}</span></div>
              </div>
            ) : <div>Loading stats...</div>}
          </div>
        </section>

        <section className="rounded-2xl p-4 shadow-md glass-card">
          <div className="mb-3 text-lg font-semibold">Historical Data</div>
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-[rgba(255,255,255,0.02)] text-left text-[var(--muted)]">
                  <th className="p-2">Date</th>
                  <th className="p-2">Open</th>
                  <th className="p-2">High</th>
                  <th className="p-2">Low</th>
                  <th className="p-2">Close</th>
                  <th className="p-2">Volume</th>
                  <th className="p-2">% Change</th>
                </tr>
              </thead>
              <tbody>
                {history.slice().reverse().map((row) => (
                  <tr key={`${row.index_name}-${row.date}`} className="border-t border-[rgba(255,255,255,0.03)]">
                    <td className="p-2">{row.date}</td>
                    <td className="p-2">{formatCurrency(row.open)}</td>
                    <td className="p-2">{formatCurrency(row.high)}</td>
                    <td className="p-2">{formatCurrency(row.low)}</td>
                    <td className="p-2">{formatCurrency(row.close)}</td>
                    <td className="p-2">{row.volume.toLocaleString()}</td>
                    <td className="p-2">{row.daily_change_percent ? `${row.daily_change_percent.toFixed(2)}%` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
