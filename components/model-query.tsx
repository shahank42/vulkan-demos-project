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

interface ModelQueryProps {
  projectId: string
  models: Model[]
}

export function ModelQuery({ projectId, models }: ModelQueryProps) {
  const [selectedModel, setSelectedModel] = React.useState<string>(models[0]?.model_id || "")
  const [query, setQuery] = React.useState("")
  const [isQuerying, setIsQuerying] = React.useState(false)
  const [data, setData] = React.useState<QueryResponse | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || !selectedModel) return
    setIsQuerying(true); setError(null); setData(null)
    const result = await queryModelAction(projectId, selectedModel, query)
    if (result.error) setError(result.error)
    else if (result.data) setData(result.data)
    setIsQuerying(false)
  }

  const getScoreColor = (score: number) => {
    if (score <= 40) return "text-indigo-500"
    if (score >= 60) return "text-emerald-500"
    return "text-slate-500"
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
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

      {data && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <Card className="md:col-span-8 shadow-sm border-border/40 bg-gradient-to-br from-card to-secondary/5 overflow-hidden">
              <CardContent className="p-6 md:p-8 flex flex-col justify-between h-full relative">
                <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <Zap className="h-3 w-3" /> Neutrality Score
                    </span>
                    <div className="flex items-baseline gap-3">
                      <span className={cn("text-6xl md:text-7xl font-bold tracking-tighter leading-none", getScoreColor(data.score))}>
                        {data.score}
                      </span>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-muted-foreground">/ 100</span>
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider h-5 px-1.5 font-mono">
                          {data.alignment.replace(/_/g, " ")}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="font-mono text-[10px] uppercase opacity-70">
                    {data.approach_used.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div className="mt-8 relative z-10">
                  <div className="mb-3 flex justify-between items-end text-sm">
                    <span className={cn("font-medium transition-colors", data.score <= 40 ? "text-foreground" : "text-muted-foreground")}>Variant A Focus</span>
                    <span className={cn("font-medium transition-colors", data.score >= 60 ? "text-foreground" : "text-muted-foreground")}>Variant B Focus</span>
                  </div>
                  <BiasMeterSimple biases={data.biases} />
                </div>
              </CardContent>
            </Card>

            <div className="md:col-span-4 space-y-4 flex flex-col">
              <Card className="shadow-sm border-border/40 bg-card/40 flex-1">
                <CardContent className="p-5 flex flex-col justify-center h-full">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <Activity className="h-3 w-3" /> Uncertainty
                    </span>
                    <span className="font-mono text-xl font-bold">{data.uncertainty}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                    <div className={cn("h-full transition-all duration-1000", data.uncertainty > 20 ? "bg-amber-400" : "bg-emerald-400")}
                      style={{ width: `${Math.max(5, data.uncertainty)}%` }} />
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-border/40 bg-card/40 flex-[2]">
                <CardContent className="p-5 h-full">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-4">
                    <ShieldAlert className="h-3 w-3" /> Rhetoric
                  </span>
                  <div className="flex flex-wrap gap-2 content-start">
                    {data.identified_devices.length > 0 ? (
                      data.identified_devices.map(d => (
                        <Badge key={d} variant="outline" className="text-[10px] py-1 gap-1 border-primary/20 bg-primary/5 text-primary">{d.replace(/_/g, " ")}</Badge>
                      ))
                    ) : <div className="text-xs text-muted-foreground italic">None detected</div>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-6">
              <Card className="shadow-sm border-border/40 bg-card/60 backdrop-blur-sm">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-base font-semibold tracking-tight flex items-center gap-2 mb-4 text-foreground">
                    <Brain className="h-4 w-4 text-primary" /> Reasoning
                  </h3>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {data.reasoning}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.debate_summary && (
                  <Card className="shadow-sm border-border/40 bg-card/40 md:col-span-2">
                    <CardContent className="p-5">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Debate Dynamics</h4>
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs"><span>Perspective A</span><span className="font-mono">{((data.debate_summary.perspective_a_strength || 0) * 100).toFixed(0)}%</span></div>
                          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden"><div className="h-full bg-indigo-500/80" style={{ width: `${(data.debate_summary.perspective_a_strength || 0) * 100}%` }} /></div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs"><span>Perspective B</span><span className="font-mono">{((data.debate_summary.perspective_b_strength || 0) * 100).toFixed(0)}%</span></div>
                          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden"><div className="h-full bg-emerald-500/80" style={{ width: `${(data.debate_summary.perspective_b_strength || 0) * 100}%` }} /></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {(data.consensus_areas || data.debate_summary?.consensus_areas) && (
                  <Card className="shadow-sm border border-emerald-500/20 bg-emerald-500/5">
                    <CardContent className="p-5">
                      <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 mb-3"><Check className="h-4 w-4" /> Consensus</h4>
                      <ul className="space-y-2.5">{(data.consensus_areas || data.debate_summary?.consensus_areas || []).slice(0, 3).map((point, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex gap-2 items-start leading-relaxed"><span className="block w-1 h-1 rounded-full bg-emerald-500/40 mt-1.5 flex-shrink-0" />{point}</li>
                      ))}</ul>
                    </CardContent>
                  </Card>
                )}
                {(data.disagreement_areas || data.debate_summary?.unresolved_disagreements) && (
                  <Card className="shadow-sm border border-rose-500/20 bg-rose-500/5">
                    <CardContent className="p-5">
                      <h4 className="text-sm font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2 mb-3"><GitCompare className="h-4 w-4" /> Divergence</h4>
                      <ul className="space-y-2.5">{(data.disagreement_areas || data.debate_summary?.unresolved_disagreements || []).slice(0, 3).map((point, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex gap-2 items-start leading-relaxed"><span className="block w-1 h-1 rounded-full bg-rose-500/40 mt-1.5 flex-shrink-0" />{point}</li>
                      ))}</ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <Card className="shadow-sm border-border/40 bg-card/40 h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-semibold tracking-tight flex items-center gap-2"><Quote className="h-4 w-4 text-primary" /> Evidence</h3>
                    <Badge variant="outline" className="text-[10px]">{data.justifications.length} items</Badge>
                  </div>
                  <div className="relative space-y-6 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-border/0 before:via-border/50 before:to-border/0">
                    {data.justifications.map((item, idx) => (
                      <div key={idx} className="relative pl-10 group">
                        <div className="absolute left-[11px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-background bg-muted-foreground/30 group-hover:bg-primary group-hover:scale-110 transition-all z-10" />
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-[10px] h-5 font-medium opacity-70 group-hover:opacity-100">{item.perspective_source}</Badge>
                            <span className="text-[10px] font-mono text-muted-foreground/50 group-hover:text-primary/70">{(item.confidence * 100).toFixed(0)}% Conf</span>
                          </div>
                          <p className="text-sm text-muted-foreground group-hover:text-foreground/90 transition-colors leading-relaxed">{item.reason}</p>
                          {item.evidence_citation && <div className="bg-muted/30 p-2.5 rounded-md border border-border/20 text-xs text-muted-foreground/80 italic">"{item.evidence_citation}"</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function BiasMeterSimple({ biases }: { biases: Record<string, number> }) {
  const keys = Object.keys(biases);
  if (keys.length !== 2) return <div className="flex w-full h-3 rounded-full overflow-hidden gap-1">{keys.map((k, i) => <div key={k} className="h-full bg-primary" style={{ width: `${biases[k] * 100}%`, opacity: 0.4 + (i * 0.2) }} />)}</div>
  const [kA, kB] = keys;
  return (
    <div className="space-y-2">
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-secondary/30 relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-background/50 z-20" />
        <div className="h-full bg-gradient-to-r from-indigo-500/80 to-indigo-400" style={{ width: `${biases[kA] * 100}%` }} />
        <div className="flex-1 bg-transparent" />
        <div className="h-full bg-gradient-to-l from-emerald-500/80 to-emerald-400" style={{ width: `${biases[kB] * 100}%` }} />
      </div>
      <div className="flex justify-between items-center text-[10px] font-medium text-muted-foreground uppercase tracking-widest px-1"><span>{kA}</span><span>{kB}</span></div>
    </div>
  )
}
