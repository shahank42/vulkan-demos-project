"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createProject, queryModel, getProjectStatus, ProjectCreateInput } from "./lib/api";

export async function createProjectAction(formData: FormData) {
  const project_name = formData.get("project_name") as string;
  const creator_name = formData.get("creator_name") as string;
  const description = formData.get("description") as string;
  const tagsStr = formData.get("tags") as string;
  const variantA = formData.getAll("variant_a") as string[];
  const variantB = formData.getAll("variant_b") as string[];

  const tags = tagsStr ? tagsStr.split(",").map((t) => t.trim()) : [];
  
  const data: ProjectCreateInput = {
    project_name,
    creator_name,
    description,
    tags,
    variant: {
        variant_a: variantA.filter(Boolean),
        variant_b: variantB.filter(Boolean),
    }
  };

  try {
    const result = await createProject(data);
    if (result.status === "success") {
      revalidatePath("/");
      return { success: true, project_id: result.project_id };
    } else {
      return { error: result.message };
    }
  } catch (error: any) {
    return { error: error.message || "Failed to create project" };
  }
}

export async function checkProjectStatusAction(projectId: string) {
  try {
    const status = await getProjectStatus(projectId);
    return { data: status };
  } catch (error: any) {
    return { error: error.message || "Failed to check project status" };
  }
}

export async function queryModelAction(projectId: string, modelId: string, query: string) {
  try {
    const result = await queryModel({
      project_id: projectId,
      model_id: modelId,
      query,
    });
    return { data: result };
  } catch (error: any) {
    return { error: error.message || "Failed to query model" };
  }
}
