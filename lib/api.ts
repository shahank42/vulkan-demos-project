const API_BASE_URL = "http://localhost:8000"

export interface Variant {
  name: string
  prompt: string
}

export interface Project {
  id: string
  name: string
  variants: Variant[]
}

export interface ProjectStatus {
  id: string
  name: string
  variants: string[]
  status: string
  created_at: string
}

export interface Model {
  id: string
  name: string
  provider: string
}

export interface QueryResponse {
  variant: string
  response: string
  bias_score: number
}

export interface QueryResult {
  project_id: string
  query: string
  model: string
  responses: QueryResponse[]
  timestamp: string
}

// Project API
export async function createProject(name: string, variants: Variant[]): Promise<Project> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    variants: [
      { name: "Variant A", prompt: "" },
      { name: "Variant B", prompt: "" },
    ],
  }
}

export async function getProject(projectId: string): Promise<Project> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    id: projectId,
    name: "Sample Project",
    variants: [
      { name: "Variant A", prompt: "You are a helpful assistant." },
      { name: "Variant B", prompt: "You are a friendly and casual assistant." },
    ],
  }
}

export async function getProjectStatus(projectId: string): Promise<ProjectStatus> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    id: projectId,
    name: "Sample Project",
    variants: ["Control", "Variant A", "Variant B"],
    status: "active",
    created_at: new Date().toISOString(),
  }
}

// Models API
export async function getModels(): Promise<Model[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  return [
    { id: "gpt-4", name: "GPT-4", provider: "OpenAI" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI" },
    { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic" },
    { id: "claude-3-sonnet", name: "Claude 3 Sonnet", provider: "Anthropic" },
    { id: "llama-2-70b", name: "Llama 2 70B", provider: "Meta" },
    { id: "mistral-large", name: "Mistral Large", provider: "Mistral AI" },
  ]
}

// Query API
export async function queryProject(projectId: string, query: string, model: string): Promise<QueryResult> {
  // Simulate longer API delay for query processing
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const dummyResponses: QueryResponse[] = [
    {
      variant: "Variant A",
      response:
        "Based on the query, I would recommend considering multiple factors including feasibility, cost, and long-term impact. A balanced approach often yields the best results.",
      bias_score: 0.15,
    },
    {
      variant: "Variant B",
      response:
        "Hey! So from what you're asking, I'd say go with what feels right to you. Trust your gut and keep things simple - that usually works out pretty well!",
      bias_score: 0.42,
    },
  ]

  return {
    project_id: projectId,
    query,
    model,
    responses: dummyResponses,
    timestamp: new Date().toISOString(),
  }
}
