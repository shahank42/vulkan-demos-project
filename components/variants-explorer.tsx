"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface VariantsExplorerProps {
  variants: Record<string, string[]>
}

export function VariantsExplorer({ variants }: VariantsExplorerProps) {
  const [selectedVariant, setSelectedVariant] = useState<{ name: string, content: string } | null>(null)

  return (
    <>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(variants).map(([name, contents]) => (
          <div key={name} className="space-y-3 h-full flex flex-col">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="uppercase text-[10px] tracking-wider font-bold">
                {name}
              </Badge>
              <span className="text-xs text-muted-foreground ml-auto">{contents.length} items</span>
            </div>
            <div className="space-y-2 pl-2 border-l-2 border-muted flex-1">
              {contents.map((content, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedVariant({ name, content })}
                  className="group relative p-3 bg-muted/30 hover:bg-muted/80 rounded-md text-xs font-mono text-muted-foreground transition-all cursor-pointer border border-transparent hover:border-border hover:shadow-sm"
                  role="button"
                  tabIndex={0}
                >
                  <p className="line-clamp-1 break-all pr-4">
                    {content}
                  </p>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] bg-background border px-1.5 py-0.5 rounded shadow-sm text-foreground">Expand</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedVariant} onOpenChange={(open) => !open && setSelectedVariant(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 bg-muted/40 flex-shrink-0">
            <DialogTitle className="flex items-center gap-2 text-base">
              Variant <Badge>{selectedVariant?.name}</Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden relative bg-muted/10">
            <ScrollArea className="h-full w-full p-6">
              <pre className="text-sm font-mono whitespace-pre-wrap break-all text-foreground leading-relaxed">
                {selectedVariant?.content}
              </pre>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
