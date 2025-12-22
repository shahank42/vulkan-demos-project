"use client"

import * as React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FileText, Upload, Type, Plus, X, Trash2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface VariantInputProps {
  id: string
  label: string
}

export function VariantInput({ id, label }: VariantInputProps) {
  const [currentInput, setCurrentInput] = React.useState("")
  const [contents, setContents] = React.useState<string[]>([])
  const [activeTab, setActiveTab] = React.useState("text")

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      if (text) {
        setContents(prev => [...prev, text])
        // Reset file input
        const fileInput = document.getElementById(`file-upload-${id}`) as HTMLInputElement
        if (fileInput) fileInput.value = ""
      }
    }
    reader.readAsText(file)
  }

  const addTextContent = () => {
    if (!currentInput.trim()) return
    setContents(prev => [...prev, currentInput])
    setCurrentInput("")
  }

  const removeContent = (index: number) => {
    setContents(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="space-y-3 shrink-0">
        <Label className="text-base font-semibold">{label}</Label>

        {/* Hidden inputs to submit array of values */}
        {contents.map((content, i) => (
          <input key={i} type="hidden" name={id} value={content} />
        ))}
        {/* Fallback empty input if no contents to ensure something is sent? 
            actually if strictly empty maybe better not to send. 
            But let's leave it as is, form submission handles empty arrays fine. */}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Text Input
            </TabsTrigger>
            <TabsTrigger value="file" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              File Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="pt-2 space-y-3">
            <Textarea
              placeholder={`Enter content for ${label}...`}
              className="min-h-[120px] font-mono text-xs resize-none"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
            />
            <Button
              type="button"
              onClick={addTextContent}
              disabled={!currentInput.trim()}
              className="w-full"
              variant="secondary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Text Content
            </Button>
          </TabsContent>

          <TabsContent value="file" className="pt-2">
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-4 hover:bg-muted/50 transition-colors bg-muted/20">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="text-center space-y-1">
                <h4 className="text-sm font-medium">Upload a text file</h4>
                <p className="text-xs text-muted-foreground">.txt files only</p>
              </div>
              <Input
                id={`file-upload-${id}`}
                type="file"
                accept=".txt"
                className="max-w-xs cursor-pointer"
                onChange={handleFileUpload}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex-1 min-h-[100px] bg-muted/30 rounded-lg border p-1 overflow-hidden flex flex-col">
        <div className="p-2 bg-muted/20 text-xs font-medium text-muted-foreground flex justify-between items-center">
          <span>Added Contents ({contents.length})</span>
          {contents.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-auto text-xs px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setContents([])}
            >
              Clear All
            </Button>
          )}
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {contents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-8 text-muted-foreground opacity-50 space-y-2">
                <div className="p-2 rounded-full bg-muted">
                  <FileText className="h-6 w-6" />
                </div>
                <p className="text-xs">No content added yet</p>
              </div>
            ) : (
              contents.map((content, idx) => (
                <div key={idx} className="group relative bg-background border rounded-md p-3 text-xs font-mono shadow-sm">
                  <div className="line-clamp-3 pr-6 text-muted-foreground">
                    {content}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    onClick={() => removeContent(idx)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <p className="text-xs text-muted-foreground mt-2">
        {id === "variant_a" ? "Content Source (Variant A)" : "Content Source (Variant B)"} - Add multiple text snippets or files to construct the knowledge base.
      </p>
    </div>
  )
}
