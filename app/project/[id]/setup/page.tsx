"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProjectSetupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const [variantA, setVariantA] = React.useState("")
  const [variantB, setVariantB] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const router = useRouter()

  const handleFileUpload = async (variant: "A" | "B", file: File) => {
    const text = await file.text()
    if (variant === "A") {
      setVariantA(text)
    } else {
      setVariantB(text)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call to save variants
      await new Promise((resolve) => setTimeout(resolve, 500))
      router.push(`/project/${id}`)
    } catch (error) {
      console.error("Failed to save variants:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isValid = variantA.trim() !== "" && variantB.trim() !== ""

  return (
    <div className="min-h-screen bg-background">
      <div>
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-xl font-semibold">Setup Variants</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="variantA" className="text-base font-semibold">
                Variant A
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const input = document.createElement("input")
                  input.type = "file"
                  input.accept = ".txt"
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) handleFileUpload("A", file)
                  }
                  input.click()
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload .txt
              </Button>
            </div>
            <Textarea
              id="variantA"
              placeholder="Enter content for Variant A or upload a file..."
              value={variantA}
              onChange={(e) => setVariantA(e.target.value)}
              rows={8}
              required
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="variantB" className="text-base font-semibold">
                Variant B
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const input = document.createElement("input")
                  input.type = "file"
                  input.accept = ".txt"
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) handleFileUpload("B", file)
                  }
                  input.click()
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload .txt
              </Button>
            </div>
            <Textarea
              id="variantB"
              placeholder="Enter content for Variant B or upload a file..."
              value={variantB}
              onChange={(e) => setVariantB(e.target.value)}
              rows={8}
              required
              className="font-mono text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => router.push("/")}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? "Saving..." : "Continue"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
