"use client"

import * as React from "react"
import { Model, QueryResponse, HistoryItem } from "@/app/lib/api"
import { ModelQuery } from "./model-query"
import { HistoryList } from "./history-list"

interface ProjectAnalysisContainerProps {
  projectId: string
  models: Model[]
  initialHistory: HistoryItem[]
}

export function ProjectAnalysisContainer({ projectId, models, initialHistory }: ProjectAnalysisContainerProps) {
  const [query, setQuery] = React.useState("")
  const [selectedModel, setSelectedModel] = React.useState<string>(models[0]?.model_id || "")
  const [data, setData] = React.useState<QueryResponse | null>(null)
  const [isQuerying, setIsQuerying] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleHistorySelect = (item: HistoryItem) => {
    setQuery(item.query)
    setSelectedModel(item.model_id)
    setData(item.response)
    setError(null)

    // Scroll to results if needed
    window.scrollTo({ top: 400, behavior: 'smooth' })
  }

  return (
    <div className="space-y-8">
      <HistoryList
        history={initialHistory}
        onSelect={handleHistorySelect}
      />
      <ModelQuery
        projectId={projectId}
        models={models}
        query={query}
        setQuery={setQuery}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        data={data}
        setData={setData}
        isQuerying={isQuerying}
        setIsQuerying={setIsQuerying}
        error={error}
        setError={setError}
      />
    </div>
  )
}
