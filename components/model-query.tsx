"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Model, QueryResponse } from "@/app/lib/api"
import { queryModelAction } from "@/app/actions"
import { Sparkles, Send, Brain, ShieldAlert, Zap, Quote, AlertCircle, Check, GitCompare, Activity } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import { ModelQueryResults } from "./model-query-results"

interface ModelQueryProps {
  projectId: string
  models: Model[]
  query: string
  setQuery: (q: string) => void
  selectedModel: string
  setSelectedModel: (m: string) => void
  isQuerying: boolean
  setIsQuerying: (loading: boolean) => void
  data: QueryResponse | null
  setData: (data: QueryResponse | null) => void
  error: string | null
  setError: (err: string | null) => void
}

export function ModelQuery({
  projectId,
  models,
  query,
  setQuery,
  selectedModel,
  setSelectedModel,
  isQuerying,
  setIsQuerying,
  data,
  setData,
  error,
  setError
}: ModelQueryProps) {
  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || !selectedModel) return
    setIsQuerying(true); setError(null); setData(null)
    const result = await queryModelAction(projectId, selectedModel, query)
    if (result.error) setError(result.error)
    else if (result.data) setData(result.data)
    setIsQuerying(false)
  }

  return (
    <div className="space-y-8 w-full pb-20">
      <div className="relative group z-10 w-full">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-[24px] blur-md opacity-40 group-hover:opacity-60 transition duration-700"></div>
        <Card className="relative shadow-2xl border-border/40 bg-background/60 backdrop-blur-xl overflow-hidden rounded-[22px] transition-all duration-300 ring-1 ring-white/5 group-hover:ring-white/10">
          <CardContent className="p-0">
            <form onSubmit={handleQuery} className="group/form relative">
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a question or describe what you want to analyze..."
                disabled={isQuerying}
                className="w-full min-h-[120px] px-6 py-4 pb-16 border-none shadow-none resize-none bg-transparent focus-visible:ring-0 text-lg placeholder:text-muted-foreground/40 leading-relaxed font-light scrollbar-hide"
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (!isQuerying && query.trim()) handleQuery(e as any); } }}
              />

              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center gap-2">
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="h-9 w-auto min-w-[140px] border-0 bg-muted/50 hover:bg-muted/80 shadow-sm transition-all rounded-full px-4 text-xs font-medium text-muted-foreground hover:text-foreground focus:ring-0 gap-2 backdrop-blur-md">
                    <Brain className="h-3.5 w-3.5" />
                    <span className="truncate max-w-[180px]">
                      {models.find(m => m.model_id === selectedModel)?.model_id.replace(/_/g, ' ') || "Select Method"}
                    </span>
                  </SelectTrigger>
                  <SelectContent className="w-[300px]">
                    <div className="px-2 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-muted/30">Analysis Method</div>
                    {models.map((model) => (
                      <SelectItem key={model.model_id} value={model.model_id} className="py-3 cursor-pointer focus:bg-primary focus:text-primary-foreground">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-sm">{model.model_id.replace(/_/g, ' ')}</span>
                          <span className="text-xs opacity-70 leading-snug">{model.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="submit"
                  size="icon"
                  className={cn(
                    "h-10 w-10 rounded-full shadow-lg transition-all duration-300",
                    isQuerying ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105"
                  )}
                  disabled={isQuerying || !query.trim()}
                >
                  {isQuerying ? <Sparkles className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 ml-0.5" />}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/5 text-destructive flex items-center gap-3 text-sm font-medium border border-destructive/20 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {data && <ModelQueryResults data={data} />}
    </div>
  )
}
