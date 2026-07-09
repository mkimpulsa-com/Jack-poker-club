"use client"

import type React from "react"
import { useState, useRef, useMemo } from "react"
import { cn } from "@/lib/utils"

type ChartDataPoint = {
  label: string;
  value: number;
};

interface BudgetCardProps {
  data: ChartDataPoint[];
  totalProfit: number;
  periodProfit: number;
}

export function BudgetCard({ data, totalProfit, periodProfit }: BudgetCardProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const chartRef = useRef<SVGSVGElement>(null)

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return [{ label: "N/A", value: 0 }];
    }
    return data;
  }, [data]);

  const hasData = useMemo(() => data && data.length > 0, [data]);

  const maxValue = useMemo(() => hasData ? Math.max(...chartData.map((d) => d.value), 0) : 0, [chartData, hasData]);
  const minValue = useMemo(() => hasData ? Math.min(...chartData.map((d) => d.value), 0) : 0, [chartData, hasData]);
  
  const chartHeight = 160
  const chartWidth = 360
  const padding = { top: 40, bottom: 35, left: 10, right: 10 }

  const getY = (value: number) => {
    const range = maxValue - minValue;
    if (range === 0) {
        return chartHeight - padding.bottom;
    }
    const normalized = (value - minValue) / range;
    return chartHeight - padding.bottom - normalized * (chartHeight - padding.top - padding.bottom);
  }

  const getX = (index: number) => {
    if (chartData.length <= 1) {
        return chartWidth / 2;
    }
    return padding.left + (index / (chartData.length - 1)) * (chartWidth - padding.left - padding.right)
  }

  const generatePath = () => {
    if (!hasData) return "";
    const points = chartData.map((d, i) => ({ x: getX(i), y: getY(d.value) }))

    if (points.length <= 1) {
      return `M ${points[0].x} ${points[0].y}`;
    }

    let path = `M ${points[0].x} ${points[0].y}`

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i]
      const p1 = points[i]
      const p2 = points[i + 1]
      const p3 = points[i + 2] || p2

      const tension = 0.35
      const cp1x = p1.x + (p2.x - p0.x) * tension
      const cp1y = p1.y + (p2.y - p0.y) * tension
      const cp2x = p2.x - (p3.x - p1.x) * tension
      const cp2y = p2.y - (p3.y - p1.y) * tension

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
    }

    return path
  }

  const generateAreaPath = () => {
    if (!hasData) return "";
    const linePath = generatePath()
    const lastPoint = chartData.length - 1
    return `${linePath} L ${getX(lastPoint)} ${chartHeight - padding.bottom} L ${getX(0)} ${chartHeight - padding.bottom} Z`
  }

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!chartRef.current || !hasData) return
    const rect = chartRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const relativeX = (x / rect.width) * chartWidth

    let closestIndex = 0
    let closestDist = Number.POSITIVE_INFINITY
    chartData.forEach((_, i) => {
      const dist = Math.abs(getX(i) - relativeX)
      if (dist < closestDist) {
        closestDist = dist
        closestIndex = i
      }
    })
    setHoveredIndex(closestIndex)
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
  }

  const ProfitArrow = ({ value }: { value: number }) => {
    const isPositive = value >= 0;
    const isZero = value === 0;
    if (isZero) return null;

    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={cn("text-foreground", isPositive ? "text-green-500" : "text-red-500")}>
            <path
                d="M8 3L8 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M4 7L8 3L12 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform={isPositive ? "" : "rotate(180 8 8)"}
            />
        </svg>
    )
  }


  return (
    <div className="relative w-full max-w-[420px] rounded-[40px] bg-gradient-to-b from-muted/50 to-muted/60 p-3.5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.4)_inset] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05)_inset]">
      <div
        className="absolute inset-[1px] rounded-[39px] bg-gradient-to-b from-background/60 to-transparent pointer-events-none dark:from-background/30"
        style={{ height: "50%" }}
      />

      <div className="relative overflow-hidden rounded-[28px] bg-card p-7 pb-5 shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.05)]">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-[15px] font-medium tracking-wide text-muted-foreground">Balance Total</p>
            <h2 className={cn("mt-1.5 text-[46px] font-semibold leading-[1] tracking-[-0.02em]", totalProfit >= 0 ? 'text-green-500' : 'text-red-500')}>
              ${totalProfit.toFixed(2)}
            </h2>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-4 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2),0_1px_3px_rgba(255,255,255,0.05)]">
              <span className={cn("text-[14px] font-semibold", periodProfit >= 0 ? 'text-green-500' : 'text-red-500')}>
                {periodProfit >= 0 ? '+' : ''} ${periodProfit.toFixed(2)}
              </span>
              <ProfitArrow value={periodProfit} />
            </div>
          </div>
        </div>

        <div className="relative mt-2">
          {hasData ? (
          <svg
            ref={chartRef}
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: "default" }}
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" className="dark:stop-opacity-40" />
                <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.15" className="dark:stop-opacity-20" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.02" className="dark:stop-opacity-5" />
              </linearGradient>
            </defs>

            <path d={generateAreaPath()} fill="url(#areaGradient)" className="transition-all duration-300" />
            <path
              d={generatePath()}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {hoveredIndex !== null && (
              <g className="transition-all duration-150 ease-out">
                <circle
                  cx={getX(hoveredIndex)}
                  cy={getY(chartData[hoveredIndex].value)}
                  r="12"
                  className="fill-card"
                  opacity="0.5"
                />
                <circle
                  cx={getX(hoveredIndex)}
                  cy={getY(chartData[hoveredIndex].value)}
                  r="8"
                  className="fill-card"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                />
              </g>
            )}
            {chartData.map((d, i) => (
              <text
                key={i}
                x={getX(i)}
                y={chartHeight - 8}
                textAnchor="middle"
                className="text-[12px] font-medium fill-muted-foreground"
              >
                {d.label}
              </text>
            ))}
          </svg>
          ) : (
            <div className="flex h-[160px] items-center justify-center text-muted-foreground">
                No hay datos para este período.
            </div>
          )}
          {hoveredIndex !== null && hasData && (
            <div
              className="pointer-events-none absolute transition-all duration-150 ease-out"
              style={{
                left: `${(getX(hoveredIndex) / chartWidth) * 100}%`,
                top: `${(getY(chartData[hoveredIndex].value) / chartHeight) * 100}%`,
                transform: "translate(-50%, -140%)",
              }}
            >
              <div className="relative rounded-xl bg-foreground/90 px-4 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.2)] dark:bg-background/90 backdrop-blur-sm">
                <span className="text-[14px] font-semibold text-background dark:text-foreground">
                  ${chartData[hoveredIndex].value.toFixed(2)}
                </span>
                <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-foreground/90 dark:border-t-background/90" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}