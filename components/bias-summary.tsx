"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from "lucide-react"
import type { QueryResponse } from "@/lib/api"

interface BiasSummaryProps {
  responses: QueryResponse[]
}

export function BiasSummary({ responses }: BiasSummaryProps) {
  const avgBias = responses.reduce((sum, r) => sum + r.bias_score, 0) / responses.length
  const maxBias = Math.max(...responses.map((r) => r.bias_score))
  const minBias = Math.min(...responses.map((r) => r.bias_score))
  const biasRange = maxBias - minBias

  const stats = [
    {
      label: "Average Bias",
      value: `${(avgBias * 100).toFixed(1)}%`,
      icon: avgBias < 0.3 ? CheckCircle : AlertTriangle,
      color: avgBias < 0.2 ? "text-chart-2" : avgBias < 0.4 ? "text-chart-3" : "text-destructive",
    },
    {
      label: "Highest Bias",
      value: `${(maxBias * 100).toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-destructive",
    },
    {
      label: "Lowest Bias",
      value: `${(minBias * 100).toFixed(1)}%`,
      icon: TrendingDown,
      color: "text-chart-2",
    },
    {
      label: "Variance",
      value: `${(biasRange * 100).toFixed(1)}%`,
      icon: AlertTriangle,
      color: biasRange > 0.2 ? "text-chart-3" : "text-muted-foreground",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bias Analysis</CardTitle>
        <CardDescription>Statistical overview of bias scores across variants</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <stat.icon className={`h-5 w-5 ${stat.color} mt-0.5`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
