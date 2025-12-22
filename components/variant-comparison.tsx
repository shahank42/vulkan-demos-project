"use client"
import type { QueryResponse } from "@/lib/api"

interface VariantComparisonProps {
  responses: QueryResponse[]
}

export function VariantComparison({ responses }: VariantComparisonProps) {
  const sortedResponses = [...responses].sort((a, b) => a.bias_score - b.bias_score)

  const getBiasLabel = (score: number) => {
    if (score < 0.2) return { label: "Low", color: "text-chart-2 bg-chart-2/10 border-chart-2/20" }
    if (score < 0.4) return { label: "Moderate", color: "text-chart-3 bg-chart-3/10 border-chart-3/20" }
    return { label: "High", color: "text-destructive bg-destructive/10 border-destructive/20" }
  }

  const variantA = responses.find((r) => r.variant === "Variant A")
  const variantB = responses.find((r) => r.variant === "Variant B")

  if (!variantA || !variantB) return null

  const leaningToward = variantA.bias_score < variantB.bias_score ? "Variant A" : "Variant B"
  const difference = Math.abs(variantA.bias_score - variantB.bias_score)
  const percentageDiff = (difference * 100).toFixed(1)

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <h3 className="font-semibold">Result</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted">
          <span className="text-sm font-medium">Variant A</span>
          <span className="text-sm font-mono">{(variantA.bias_score * 100).toFixed(1)}%</span>
        </div>
        <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted">
          <span className="text-sm font-medium">Variant B</span>
          <span className="text-sm font-mono">{(variantB.bias_score * 100).toFixed(1)}%</span>
        </div>
      </div>
      <div className="pt-2 border-t">
        <p className="text-sm leading-relaxed">
          The query is leaning towards <span className="font-semibold">{leaningToward}</span> by{" "}
          <span className="font-semibold">{percentageDiff}%</span>
        </p>
      </div>
    </div>
  )
}
