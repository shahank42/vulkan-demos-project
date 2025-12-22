"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ProjectStatus } from "@/lib/api"
import { CalendarDays, FileText } from "lucide-react"

interface ProjectCardProps {
  project: ProjectStatus
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusColors: Record<string, string> = {
    active: "bg-chart-2 text-chart-2",
    inactive: "bg-muted-foreground text-muted-foreground",
    processing: "bg-chart-3 text-chart-3",
  }

  return (
    <Link href={`/project/${project.id}`}>
      <Card className="h-full hover:border-primary transition-colors cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-xl text-balance">{project.name}</CardTitle>
            <Badge variant="secondary" className={statusColors[project.status] || ""}>
              {project.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{project.variants.length} variants</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>
              {new Date(project.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.variants.slice(0, 3).map((variant) => (
              <Badge key={variant} variant="outline" className="text-xs">
                {variant}
              </Badge>
            ))}
            {project.variants.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.variants.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
