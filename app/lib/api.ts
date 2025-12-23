const API_BASE_URL = "https://proj.12082004.xyz";

export interface ProjectCreateInput {
  project_name: string;
  creator_name: string;
  description: string;
  tags: string[];
  variant: Record<string, string[]>;
}

export interface ProjectCreateResponse {
  status: "success" | "failure";
  project_id: string;
  message: string;
}

export interface ProjectsResponse {
  projects: string[];
}

export interface ProjectInfo {
  project_name: string;
  creator_name: string;
  description: string;
  tags: string[];
  variants: Record<string, string[]>;
}

export interface ProjectStatus {
  status: "ready" | "scraping";
  last_updated: string;
  message: string;
}

export interface Model {
  model_id: string;
  description: string;
}

export interface ModelsResponse {
  models: Model[];
}

export interface QueryInput {
  project_id: string;
  query: string;
  model_id: string;
}

export interface Evidence {
    reason: string;
    evidence_citation: string;
    perspective_source: string;
    confidence: number;
}

export interface Weakness {
    issue: string;
}

export interface Critique {
    weaknesses?: Weakness[];
    adjusted_score_suggestion?: number;
    valid_points?: string[];
    blind_spots?: string[];
}

export interface DebateSummary {
    perspective_a_strength: number;
    perspective_b_strength: number;
    consensus_areas: string[];
    unresolved_disagreements: string[];
}

export interface QueryResponse {
    score: number;
    alignment: string;
    justifications: Evidence[];
    identified_devices: string[];
    uncertainty: number;
    reasoning: string;
    biases: Record<string, number>;
    approach_used: string;
    consensus_areas?: string[];
    disagreement_areas?: string[];
    debate_summary?: DebateSummary;
    error?: string;
}

export interface ScrapedFile {
  filename: string;
  content: string;
}

export interface ScrapedDataResponse {
  variants: Record<string, ScrapedFile[]>;
}

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  };

  // If it's a GET request and has a body, move body to query params
  if (fetchOptions.method === "GET" && fetchOptions.body) {
    try {
      const body = JSON.parse(fetchOptions.body as string);
      Object.keys(body).forEach(key => url.searchParams.append(key, body[key]));
      delete fetchOptions.body;
    } catch (e) {
      console.error("Failed to parse GET body:", e);
    }
  }

  console.log(`API [${fetchOptions.method}] ${url.toString()}`);

  try {
    const response = await fetch(url.toString(), fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error [${response.status}] ${response.statusText}: ${errorText}`);
      throw new Error(`API request failed: ${response.statusText} (${response.status})`);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
}

export async function getProjects(): Promise<string[]> {
  const data = await apiFetch<ProjectsResponse>("/allprojects", { method: "GET" });
  return data.projects;
}

export async function createProject(data: ProjectCreateInput): Promise<ProjectCreateResponse> {
  return apiFetch<ProjectCreateResponse>("/createproject", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getProjectInfo(projectId: string): Promise<ProjectInfo> {
  return apiFetch<ProjectInfo>("/projectinfo", {
    method: "GET",
    body: JSON.stringify({ project_id: projectId }),
  });
}

export async function getProjectStatus(projectId: string): Promise<ProjectStatus> {
  return apiFetch<ProjectStatus>("/projectstatus", {
    method: "GET",
    body: JSON.stringify({ project_id: projectId }),
  });
}

export async function getModels(): Promise<Model[]> {
  const data = await apiFetch<ModelsResponse>("/allmodels", { method: "GET" });
  return data.models;
}

export async function queryModel(data: QueryInput): Promise<QueryResponse> {
  return apiFetch<QueryResponse>("/query", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getScrapedData(projectId: string): Promise<ScrapedDataResponse> {
  return apiFetch<ScrapedDataResponse>("/scrapeddata", {
    method: "GET",
    body: JSON.stringify({ project_id: projectId }),
  });
}
