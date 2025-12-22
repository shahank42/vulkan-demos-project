"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { FileText, Database } from "lucide-react"
import { ScrapedDataResponse, ScrapedFile } from "@/app/lib/api"

interface ScrapedDataExplorerProps {
  data: ScrapedDataResponse
}

export function ScrapedDataExplorer({ data }: ScrapedDataExplorerProps) {
  const [selectedFile, setSelectedFile] = useState<{ variant: string, file: ScrapedFile } | null>(null)

  const hasData = data && data.variants && Object.keys(data.variants).length > 0

  if (!hasData) {
    return null
  }

  return (
    <>
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="h-5 w-5 text-muted-foreground" />
            Scraped Data
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            <div className="p-6 pt-0 space-y-6">
              {Object.entries(data.variants).map(([variantName, files]) => (
                <div key={variantName} className="space-y-3">
                  <div className="flex items-center gap-2 sticky top-0 bg-card py-2 z-10">
                    <Badge variant="outline" className="uppercase text-[10px] tracking-wider font-bold bg-muted/50">
                      {variantName}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto">{files.length} files</span>
                  </div>
                  <div className="space-y-1 pl-2 border-l-2 border-muted">
                    {files.map((file, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedFile({ variant: variantName, file })}
                        className="group flex items-start gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors text-xs"
                        role="button"
                        tabIndex={0}
                      >
                        <FileText className="h-3 w-3 mt-0.5 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
                        <span className="text-muted-foreground group-hover:text-foreground break-all line-clamp-2 transition-colors">
                          {file.filename}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={!!selectedFile} onOpenChange={(open) => !open && setSelectedFile(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 bg-muted/40 flex-shrink-0">
            <DialogTitle className="flex items-center gap-2 text-base truncate pr-8">
              <span className="text-muted-foreground font-normal">File:</span>
              <span className="font-mono text-sm">{selectedFile?.file.filename}</span>
              {selectedFile && (
                <Badge variant="outline" className="ml-auto flex-shrink-0">
                  {selectedFile.variant}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto relative bg-muted/10 p-6">
            <pre className="text-xs md:text-sm font-mono whitespace-pre-wrap break-all text-foreground leading-relaxed">
              {selectedFile?.file.content}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
