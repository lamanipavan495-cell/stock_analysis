import React, { useEffect, useRef } from 'react'
import { createChart } from 'lightweight-charts'
import { COLORS } from '../lib/api'

export default function Sparkline({ data, positive = true, height = 60 }) {
    const containerRef = useRef(null)

    useEffect(() => {
        if (!containerRef.current || !data || data.length === 0) return

        const chart = createChart(containerRef.current, {
            width: containerRef.current.clientWidth,
            height,
            layout: { background: { color: 'transparent' }, textColor: COLORS.textSecondary },
            grid: { vertLines: { visible: false }, horzLines: { visible: false } },
            rightPriceScale: { visible: false },
            leftPriceScale: { visible: false },
            timeScale: { visible: false },
            crosshair: { horzLine: { visible: false }, vertLine: { visible: false } },
            handleScroll: false,
            handleScale: false,
        })

        const color = positive ? COLORS.bull : COLORS.bear
        const series = chart.addAreaSeries({ lineColor: color, topColor: `${color}55`, bottomColor: `${color}00`, lineWidth: 2 })

        const points = data.map((v, i) => ({ time: (i + 1) * 86400, value: v }))
        series.setData(points)
        chart.timeScale().fitContent()

        const ro = new ResizeObserver(() => { if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth }) })
        ro.observe(containerRef.current)

        return () => { ro.disconnect(); chart.remove() }
    }, [data, positive, height])

    return <div ref={containerRef} style={{ width: '100%', height }} data-testid="sparkline-chart" />
}
