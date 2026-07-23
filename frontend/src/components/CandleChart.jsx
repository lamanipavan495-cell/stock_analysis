import React, { useEffect, useRef } from 'react'
import { createChart } from 'lightweight-charts'
import { COLORS } from '../lib/api'

export default function CandleChart({ candles = [], volume = [], height = 480 }) {
    const containerRef = useRef(null)

    useEffect(() => {
        if (!containerRef.current || candles.length === 0) return

        const chart = createChart(containerRef.current, {
            width: containerRef.current.clientWidth,
            height,
            layout: { background: { color: 'transparent' }, textColor: COLORS.textSecondary, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 },
            grid: { vertLines: { color: COLORS.borderDim, style: 1 }, horzLines: { color: COLORS.borderDim, style: 1 } },
            rightPriceScale: { borderColor: COLORS.borderDim },
            timeScale: { borderColor: COLORS.borderDim, timeVisible: false },
            crosshair: { mode: 1 },
        })

        const candleSeries = chart.addCandlestickSeries({
            upColor: COLORS.bull,
            downColor: COLORS.bear,
            borderUpColor: COLORS.bull,
            borderDownColor: COLORS.bear,
            wickUpColor: COLORS.bull,
            wickDownColor: COLORS.bear,
        })
        candleSeries.setData(candles)

        const volSeries = chart.addHistogramSeries({ priceFormat: { type: 'volume' }, priceScaleId: 'vol', color: COLORS.borderDim })
        volSeries.priceScale().applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } })
        volSeries.setData(volume)

        chart.timeScale().fitContent()

        const ro = new ResizeObserver(() => { if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth }) })
        ro.observe(containerRef.current)

        return () => { ro.disconnect(); chart.remove() }
    }, [candles, volume, height])

    return <div ref={containerRef} style={{ width: '100%', height }} data-testid="candle-chart" />
}
