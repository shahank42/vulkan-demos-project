"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { VariantInput } from "@/components/variant-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { ArrowLeft, Save, Sparkles } from "lucide-react"
import { createProjectAction, checkProjectStatusAction } from "@/app/actions"
import Link from "next/link"

export default function CreateProjectStep2() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Polling state
  const [isPolling, setIsPolling] = React.useState(false)
  const [pollingLogs, setPollingLogs] = React.useState<string[]>([])
  const [currentStatus, setCurrentStatus] = React.useState<string>("Initializing...")

  const projectName = searchParams.get("project_name")
  const creatorName = searchParams.get("creator_name")
  const description = searchParams.get("description")
  const tags = searchParams.get("tags")

  if (!projectName || !creatorName) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-destructive">Missing Information</CardTitle>
            <CardDescription>
              We couldn't find the necessary project details. Please start over.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Link href="/">
              <Button variant="outline">Go Back Home</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    // Append the hidden fields from Step 1
    formData.append("project_name", projectName)
    formData.append("creator_name", creatorName)
    formData.append("description", description || "")
    formData.append("tags", tags || "")

    try {
      const result = await createProjectAction(formData)

      if (result?.error) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }

      if (result?.success && result.project_id) {
        // Start polling
        setIsPolling(true)
        setPollingLogs(prev => [...prev, `Project created with ID: ${result.project_id}`])
        pollStatus(result.project_id)
      }
    } catch (err) {
      setError("An unexpected error occurred")
      setIsSubmitting(false)
    }
  }

  const pollStatus = async (projectId: string) => {
    const pollInterval = setInterval(async () => {
      const result = await checkProjectStatusAction(projectId)

      if (result.error) {
        setPollingLogs(prev => [...prev, `Error checking status: ${result.error}`])
        return
      }

      if (result.data) {
        const { status, message } = result.data
        setCurrentStatus(status)

        // Split the message by newlines to properly display multiline logs
        if (message) {
          const lines = message.split('\n').filter(line => line.trim() !== '')
          // We replace the logs with the latest message content (assuming it contains the full history or relevant window)
          // We can preserve the initial "Project created" log if we want, but if the API returns full logs, we might just show that.
          // For now, let's append the API logs to the initial success message.
          setPollingLogs([`Project created with ID: ${projectId}`, ...lines])
        }

        if (status === "ready") {
          clearInterval(pollInterval)
          setPollingLogs(prev => [...prev, "Project is ready! Redirecting..."])
          setTimeout(() => {
            router.push(`/project/${projectId}`)
          }, 1000)
        }
      }
    }, 2000) // Poll every 2 seconds
  }

  if (isPolling) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl shadow-lg border-primary/20">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <CardTitle className="text-2xl">Creating Project</CardTitle>
            <CardDescription className="text-lg font-medium text-primary">
              Status: {currentStatus.toUpperCase()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground mb-4">
              Please wait while we process your request. This may take a few moments.
            </div>

            <div className="bg-muted/50 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm border">
              <div className="flex flex-col space-y-2">
                {pollingLogs.map((log, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="text-muted-foreground shrink-0 w-24 text-xs">
                      {new Date().toLocaleTimeString()}
                    </span>
                    <span className="break-all">{log}</span>
                  </div>
                ))}
                <div ref={(el) => { el?.scrollIntoView({ behavior: "smooth" }) }} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-center text-xs text-muted-foreground">
            Do not close this window
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Add Project Knowledge Base</h1>
            <p className="text-muted-foreground">Step 2 of 2: Define knowledge sources for your variants</p>
          </div>
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Details
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Variant A</CardTitle>
                <CardDescription>Knowledge Base Source</CardDescription>
              </CardHeader>
              <CardContent>
                <VariantInput id="variant_a" label="Content Source" />
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle>Variant B</CardTitle>
                <CardDescription>Knowledge Base Source</CardDescription>
              </CardHeader>
              <CardContent>
                <VariantInput id="variant_b" label="Content Source" />
              </CardContent>
            </Card>
          </div>

          {error && (
            <div className="mt-6 p-4 border border-destructive/50 bg-destructive/5 rounded-lg text-destructive text-sm text-center font-medium">
              {error}
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <Button type="submit" size="lg" className="min-w-[200px]" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Creating Project...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Finalize & Create Project
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
