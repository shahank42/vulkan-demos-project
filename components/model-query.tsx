"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Model } from "@/app/lib/api"
import { queryModelAction } from "@/app/actions"
import { Sparkles, Send, Brain, Bot, Scale } from "lucide-react"

import { Badge } from "@/components/ui/badge"

interface ModelQueryProps {
  projectId: string
  models: Model[]
}

export function ModelQuery({ projectId, models }: ModelQueryProps) {
  const [selectedModel, setSelectedModel] = React.useState<string>(models[0]?.model_id || "")
  const [query, setQuery] = React.useState("")
  const [isQuerying, setIsQuerying] = React.useState(false)
  const [response, setResponse] = React.useState<string | null>(null)
  const [biases, setBiases] = React.useState<Record<string, number> | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || !selectedModel) return

    setIsQuerying(true)
    setError(null)
    setResponse(null)
    setBiases(null)

    const result = await queryModelAction(projectId, selectedModel, query)

    if (result.error) {
      setError(result.error)
    } else if (result.data) {
      setResponse(result.data.response)
      setBiases(result.data.biases)
    }
    setIsQuerying(false)
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-none border-border/60">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            Query Model
          </CardTitle>
          <CardDescription>
            Select a method and input your query to analyze potential biases.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleQuery} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none">Method Selection</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-full bg-background/50">
                  <SelectValue placeholder="Select a method" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.model_id} value={model.model_id}>
                      <span className="font-medium">{model.model_id}</span>
                      <span className="ml-2 text-muted-foreground text-xs border-l pl-2">{model.description}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none">Your Input</label>
              <div className="relative">
                <Textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter your prompt here..."
                  disabled={isQuerying}
                  className="min-h-[120px] resize-none pr-12 text-sm leading-relaxed bg-background/50 focus:bg-background transition-colors"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute bottom-3 right-3 h-8 w-8 rounded-full shadow-sm"
                  disabled={isQuerying || !query.trim()}
                >
                  {isQuerying ? (
                    <Sparkles className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5 shadow-none">
          <CardContent className="p-4 flex items-center gap-2 text-destructive text-sm font-medium">
            <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
            {error}
          </CardContent>
        </Card>
      )}

      {response && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-6">

          <Card className="shadow-none border-border/60 overflow-hidden">
            <CardHeader className="bg-card pb-4">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Model Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm leading-7 text-muted-foreground whitespace-pre-wrap">{response}</p>
            </CardContent>
          </Card>

          {biases && Object.keys(biases).length > 0 && (
            <Card className="shadow-none border border-border/50 bg-card/50">
              <CardHeader className="pb-2 pt-6 px-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  <Scale className="h-3.5 w-3.5" />
                  Model Preference Analysis
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-2">
                {Object.keys(biases).length === 2 ? (
                  <BiasMeterTwoParty biases={biases} />
                ) : (
                  <BiasMeterMulti biases={biases} />
                )}
              </CardContent>
              {Object.keys(biases).length === 2 && (
                <CardFooter className="px-6 py-4 bg-card">
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    {(() => {
                      const [variantA, variantB] = Object.keys(biases);
                      const scoreA = biases[variantA];
                      const scoreB = biases[variantB];
                      const diff = Math.abs(scoreA - scoreB);
                      const winner = scoreA > scoreB ? variantA : variantB;
                      return (
                        <>
                          The model shows a <span className="font-bold text-foreground">{(diff * 100).toFixed(1)}% stronger preference</span> for <span className="font-medium text-foreground">{winner}</span> based on the provided context.
                        </>
                      )
                    })()}
                  </div>
                </CardFooter>
              )}
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

function BiasMeterTwoParty({ biases }: { biases: Record<string, number> }) {
  const [variantA, variantB] = Object.keys(biases);
  const scoreA = biases[variantA];
  const scoreB = biases[variantB];
  const total = scoreA + scoreB;
  const percentage = total > 0 ? (scoreB / total) * 100 : 50;

  // Formatting helper
  const fmt = (n: number) => (n * 100).toFixed(1);

  return (
    <div className="flex flex-col gap-6">
      {/* Details Row */}
      <div className="flex justify-between items-end">
        {/* A */}
        <div className="flex flex-col gap-1">
          <div className="text-lg font-bold tracking-tight text-foreground truncate max-w-[200px]" title={variantA}>
            {variantA}
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            {fmt(scoreA)}% Relevance
          </div>
        </div>

        {/* B */}
        <div className="flex flex-col gap-1 items-end text-right">
          <div className="text-lg font-bold tracking-tight text-foreground truncate max-w-[200px]" title={variantB}>
            {variantB}
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            {fmt(scoreB)}% Relevance
          </div>
        </div>
      </div>

      {/* The Meter */}
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden flex relative">
        <div
          className="h-full bg-foreground transition-all duration-1000 ease-out opacity-90"
          style={{ width: `${100 - percentage}%` }}
        />
        <div
          className="h-full bg-muted-foreground/30 transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

function BiasMeterMulti({ biases }: { biases: Record<string, number> }) {
  return (
    <div className="space-y-3">
      {Object.entries(biases).map(([variant, value]) => (
        <div key={variant} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-muted-foreground truncate max-w-[200px]">{variant}</span>
            <span className="font-mono text-xs">{(value * 100).toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary/80"
              style={{ width: `${value * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
