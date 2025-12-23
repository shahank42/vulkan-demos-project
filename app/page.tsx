import * as React from "react"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { Sparkles, ArrowRight, FolderOpen } from "lucide-react"
import { getProjects, getProjectInfo } from "@/app/lib/api"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function HomePage() {
  const projectIds = await getProjects().catch(() => [])

  const projectsMetadata = await Promise.all(
    projectIds.map(async (id) => {
      try {
        const info = await getProjectInfo(id);
        return { id, ...info };
      } catch (e) {
        console.error(`Failed to fetch info for project ${id}:`, e);
        return {
          id,
          project_name: `Project ${id.slice(0, 8)}`,
          description: "Details unavailable",
          tags: [],
          creator_name: "Unknown"
        };
      }
    })
  );

  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-primary/20">
      {/* Ambient Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />

      {/* Header Section */}
      <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 shadow-sm shadow-primary/5">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Vulkan
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Placeholder for future search/filter */}
            <CreateProjectDialog />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {projectIds.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 rounded-2xl border border-dashed border-border/60 bg-muted/5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted shadow-inner mb-6">
              <FolderOpen className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-8 text-sm max-w-xs mx-auto">
              Your workspace is empty. Create your first project to start analyzing models.
            </p>
            <CreateProjectDialog />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2">
              <p className="text-sm text-muted-foreground font-medium pl-1">
                {projectsMetadata.length} Project{projectsMetadata.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {projectsMetadata.map((project) => (
                <Link key={project.id} href={`/project/${project.id}`} className="block group h-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-xl">
                  <Card className="h-full border-muted-foreground/10 hover:border-primary/40 bg-card hover:bg-card/80 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 p-0 overflow-hidden group-focus:border-ring">
                    <CardHeader className="p-4 space-y-2 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="h-8 w-8 rounded-md bg-secondary/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors border border-transparent group-hover:border-primary/20">
                          <FolderOpen className="h-4 w-4" />
                        </div>
                        <Badge variant="outline" className="font-mono text-[10px] h-5 px-1.5 bg-background/50 text-muted-foreground group-hover:border-primary/30 transition-colors">
                          {project.id.slice(0, 6)}
                        </Badge>
                      </div>
                      <CardTitle className="text-base font-medium tracking-tight group-hover:text-primary transition-colors truncate pt-2">
                        {project.project_name}
                      </CardTitle>
                      {project.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="p-4 pt-0 pb-4">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.tags?.slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-[10px] px-1 h-4 font-normal opacity-70">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5 font-medium text-foreground/60">
                          {project.creator_name}
                        </span>
                        <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300 text-primary/80 opacity-0 group-hover:opacity-100">
                          Open <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
