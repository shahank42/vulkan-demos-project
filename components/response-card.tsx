"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle } from "lucide-react"
import type { QueryResponse } from "@/lib/api"

interface ResponseCardProps {
  response: QueryResponse
}

export function ResponseCard({ response }: ResponseCardProps) {
  const getBiasColor = (score: number) => {
    if (score < 0.2) return "text-chart-2"
    if (score < 0.4) return "text-chart-3"
    return "text-destructive"
  }

  const getBiasLabel = (score: number) => {
    if (score < 0.2) return "Low"
    if (score < 0.4) return "Moderate"
    return "High"
  }

  const biasColor = getBiasColor(response.bias_score)
  const biasLabel = getBiasLabel(response.bias_score)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-base">{response.variant}</CardTitle>
          <div className="flex items-center gap-2">
            {response.bias_score < 0.2 ? (
              <CheckCircle className="h-4 w-4 text-chart-2" />
            ) : (
              <AlertTriangle className={`h-4 w-4 ${biasColor}`} />
            )}
            <Badge variant="outline" className={biasColor}>
              {biasLabel} Bias
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed">{response.response}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Bias Score</span>
          <span className={`font-mono font-semibold ${biasColor}`}>{(response.bias_score * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${biasColor.replace("text-", "bg-")} transition-all`}
            style={{ width: `${response.bias_score * 100}%` }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
