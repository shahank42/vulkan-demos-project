
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export function CreateProjectDialog() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const params = new URLSearchParams()

    params.set("project_name", formData.get("project_name") as string)
    params.set("creator_name", formData.get("creator_name") as string)
    params.set("description", formData.get("description") as string)
    params.set("tags", formData.get("tags") as string)

    setOpen(false)
    router.push(`/project/create?${params.toString()}`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2 shadow-sm hover:shadow-md transition-all">
          <Plus className="h-4 w-4" />
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Step 1 of 2: Enter basic project details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleNext} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="project_name">Project Name</Label>
              <Input id="project_name" name="project_name" placeholder="MyExperiment" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="creator_name">Creator Name</Label>
              <Input id="creator_name" name="creator_name" placeholder="username" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="A brief description of this experiment..." className="min-h-[100px]" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input id="tags" name="tags" placeholder="e.g. testing, production, v1" />
            <p className="text-[10px] text-muted-foreground">Comma separated values</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              Next Step
              <ArrowRight className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
