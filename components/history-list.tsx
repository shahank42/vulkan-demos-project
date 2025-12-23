"use client"

import * as React from "react"
import { HistoryItem } from "@/app/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { History, Brain, Clock } from "lucide-react"
import { formatRelativeDate } from "@/lib/utils"

interface HistoryListProps {
  history: HistoryItem[]
  onSelect: (item: HistoryItem) => void
}

export function HistoryList({ history, onSelect }: HistoryListProps) {
  if (!history || history.length === 0) {
    return null
  }

  return (
    <>
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="bg-card/50 pb-4 py-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <History className="h-3.5 w-3.5 text-primary" />
            Query History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[240px]">
            <div className="divide-y divide-border/40">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className="p-4 hover:bg-muted/30 cursor-pointer transition-colors group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm font-medium text-foreground line-clamp-2 leading-relaxed">
                        {item.query}
                      </p>
                      <Badge variant="outline" className="text-[10px] font-mono shrink-0 py-0 h-4 uppercase opacity-60">
                        {item.response.alignment.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                      <span className="flex items-center gap-1.5">
                        <Brain className="h-3 w-3" />
                        {item.model_id.replace(/_/g, ' ')}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {formatRelativeDate(item.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  )
}
