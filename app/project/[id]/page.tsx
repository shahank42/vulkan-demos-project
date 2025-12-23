import * as React from "react"
import { getProjectInfo, getProjectStatus, getModels, getScrapedData, getHistory } from "@/app/lib/api"
import { ProjectAnalysisContainer } from "@/components/project-analysis-container"
import { VariantsExplorer } from "@/components/variants-explorer"
import { ScrapedDataExplorer } from "@/components/scraped-data-explorer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, Calendar, User, Tag, ArrowLeft, Terminal, LayoutList, Activity } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { formatDate, formatRelativeDate } from "@/lib/utils"

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let info, status, models, scrapedData, history
  try {
    [info, status, models, scrapedData, history] = await Promise.all([
      getProjectInfo(id),
      getProjectStatus(id),
      getModels(),
      getScrapedData(id),
      getHistory(id),
    ])
  } catch (e) {
    console.error(e)
    return notFound()
  }

  const isReady = status.status === "ready"

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">
        <div className="container mx-auto px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-primary mb-3 transition-colors group"
          >
            <ArrowLeft className="mr-1 h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">{info.project_name}</h1>
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-primary/10">
                    <User className="h-3 w-3 text-primary" />
                  </div>
                  {info.creator_name}
                </span>
                <span className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-primary/10">
                    <Calendar className="h-3 w-3 text-primary" />
                  </div>
                  Updated {formatRelativeDate(status.last_updated)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant={isReady ? "default" : "secondary"}
                className={`px-3 py-1 text-xs font-medium uppercase tracking-wide ${isReady ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20" : "animate-pulse"}`}
              >
                {status.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Content: Variants & Query */}
          <div className="lg:col-span-9 space-y-8">
            {/* Variants */}
            <Card className="border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="bg-card pb-4">
                <CardTitle className="text-base font-medium">Variants</CardTitle>
                <CardDescription className="text-xs">Knowledge Base Documents</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="max-h-[600px]">
                  <VariantsExplorer variants={info.variants} />
                </ScrollArea>
              </CardContent>
            </Card>

            <ProjectAnalysisContainer
              projectId={id}
              models={models}
              initialHistory={history.history}
            />
          </div>

          {/* Sidebar: Description - Sticky Fix: self-start ensures the column height is content-based, allowing sticky to work within parent grid */}
          <div className="lg:col-span-3 lg:order-first space-y-6 self-start sticky top-24">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <LayoutList className="h-5 w-5 text-muted-foreground" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-medium uppercase text-muted-foreground tracking-wider">Description</span>
                  <p className="text-muted-foreground leading-relaxed text-sm">{info.description}</p>
                </div>

                {/* Separator removed */}

                <div className="space-y-2">
                  <span className="text-xs font-medium uppercase text-muted-foreground tracking-wider">Tags</span>
                  <div className="flex flex-wrap gap-2">
                    {info.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="px-2 py-0.5 text-xs font-normal text-muted-foreground bg-secondary/50 hover:bg-secondary">
                        <Tag className="h-3 w-3 mr-1 opacity-70" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Separator removed */}

                <div className="pt-2 flex flex-col gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><User className="h-3 w-3" /> Creator</span>
                    <span className="font-medium text-foreground">{info.creator_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><Calendar className="h-3 w-3" /> Updated</span>
                    <span>{formatDate(status.last_updated)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scraped Data Explorer */}
            <ScrapedDataExplorer data={scrapedData} />
          </div>
        </div>
      </div>
    </div >
  )
}
