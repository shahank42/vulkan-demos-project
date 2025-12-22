"use client"

import * as React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { getModels, type Model } from "@/lib/api"

interface ModelSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const [models, setModels] = React.useState<Model[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    getModels()
      .then((data) => {
        setModels(data)
        if (data.length > 0 && !value) {
          onChange(data[0].id)
        }
      })
      .catch((error) => {
        console.error("Failed to fetch models:", error)
        // Mock data for demonstration
        const mockModels = [
          { id: "gpt-4", name: "GPT-4", provider: "OpenAI" },
          { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI" },
          { id: "claude-3", name: "Claude 3", provider: "Anthropic" },
        ]
        setModels(mockModels)
        if (!value) {
          onChange(mockModels[0].id)
        }
      })
      .finally(() => setIsLoading(false))
  }, [value, onChange])

  return (
    <div className="space-y-2">
      <Label>AI Model</Label>
      <Select value={value} onValueChange={onChange} disabled={isLoading}>
        <SelectTrigger>
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.name}
              <span className="text-xs text-muted-foreground ml-2">({model.provider})</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
