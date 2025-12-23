"use client"

import * as React from "react"
import { QueryResponse } from "@/app/lib/api"
import { Sparkles, Brain, ShieldAlert, Zap, Quote, Check, GitCompare, Activity } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ModelQueryResultsProps {
  data: QueryResponse
}

export function ModelQueryResults({ data }: ModelQueryResultsProps) {
  const getScoreColor = (score: number) => {
    if (score <= 40) return "text-indigo-500"
    if (score >= 60) return "text-emerald-500"
    return "text-slate-500"
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <Card className="md:col-span-8 shadow-sm border-border/40 bg-gradient-to-br from-card to-secondary/5 overflow-hidden">
          <CardContent className="p-6 md:p-7 flex flex-col justify-between h-full relative">
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
            <div className="mt-4 relative z-10">
              <div className="mb-2 flex justify-between items-end text-sm">
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
                ) : <div className="text-xs text-muted-foreground opacity-60">None detected</div>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 space-y-4">
          <Card className="shadow-sm border-border/40 bg-card/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-base font-semibold tracking-tight flex items-center gap-2 mb-4 text-foreground">
                <Brain className="h-4 w-4 text-primary" /> Reasoning
              </h3>
              <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-normal whitespace-pre-wrap">
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold tracking-tight flex items-center gap-2"><Quote className="h-4 w-4 text-primary" /> Evidence</h3>
                <Badge variant="outline" className="text-[10px]">{data.justifications.length} items</Badge>
              </div>
              <div className="relative space-y-4 before:absolute before:left-[13px] before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-border/0 before:via-border/50 before:to-border/0">
                {data.justifications.map((item, idx) => (
                  <div key={idx} className="relative pl-8 group">
                    <div className="absolute left-[9px] top-1.5 w-2 h-2 rounded-full border border-background bg-muted-foreground/30 group-hover:bg-primary group-hover:scale-110 transition-all z-10" />
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-[10px] h-4 font-medium opacity-70 group-hover:opacity-100">{item.perspective_source}</Badge>
                        <span className="text-[10px] font-mono text-muted-foreground/50 group-hover:text-primary/70">{(item.confidence * 100).toFixed(0)}% Conf</span>
                      </div>
                      <p className="text-[13px] text-muted-foreground group-hover:text-foreground/90 transition-colors leading-snug">{item.reason}</p>
                      {item.evidence_citation && <div className="text-[11px] text-muted-foreground/60 leading-normal border-l-2 border-border/40 pl-3 py-0.5">"{item.evidence_citation}"</div>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function BiasMeterSimple({ biases }: { biases: Record<string, number> }) {
  const keys = Object.keys(biases);
  if (keys.length !== 2) return <div className="flex w-full h-3 rounded-full overflow-hidden gap-1">{keys.map((k, i) => <div key={k} className="h-full bg-primary" style={{ width: `${biases[k] * 100}%`, opacity: 0.4 + (i * 0.2) }} />)}</div>
  const [kA, kB] = keys;
  return (
    <div className="space-y-1">
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
