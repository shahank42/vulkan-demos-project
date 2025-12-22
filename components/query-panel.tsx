"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ModelSelector } from "@/components/model-selector"
import { Send, Loader2 } from "lucide-react"
import { queryProject, type QueryResult } from "@/lib/api"

interface QueryPanelProps {
  projectId: string
  onQueryComplete: (result: QueryResult) => void
}

export function QueryPanel({ projectId, onQueryComplete }: QueryPanelProps) {
  const [query, setQuery] = React.useState("")
  const [selectedModel, setSelectedModel] = React.useState("")
  const [isQuerying, setIsQuerying] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || !selectedModel) return

    setIsQuerying(true)
    try {
      const result = await queryProject(projectId, query, selectedModel)
      onQueryComplete(result)
      setQuery("")
    } catch (error) {
      console.error("Query failed:", error)
      const mockResult: QueryResult = {
        project_id: projectId,
        query,
        model: selectedModel,
        responses: [
          {
            variant: "Variant A",
            response: "Response from Variant A context",
            bias_score: 0.23,
          },
          {
            variant: "Variant B",
            response: "Response from Variant B context",
            bias_score: 0.67,
          },
        ],
        timestamp: new Date().toISOString(),
      }
      onQueryComplete(mockResult)
      setQuery("")
    } finally {
      setIsQuerying(false)
    }
  }

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <h2 className="font-semibold">Query Variants</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <ModelSelector value={selectedModel} onChange={setSelectedModel} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="query">Query</Label>
          <Textarea
            id="query"
            placeholder="Enter your query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        <Button type="submit" disabled={!query.trim() || !selectedModel || isQuerying} className="w-full">
          {isQuerying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Querying...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Query
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
