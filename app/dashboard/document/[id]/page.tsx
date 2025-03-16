"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { DocumentEditor } from "@/components/document-editor"
import { DashboardHeader } from "@/components/dashboard-header"

interface DocumentData {
  id: string
  name: string
  content: string
  sharedWith: {
    id: string
    name: string
    email: string
    avatar?: string
    color: string
  }[]
}

export default function DocumentPage() {
  const router = useRouter()
  const params = useParams()
  const documentId = params.id as string
  const [document, setDocument] = useState<DocumentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching document data
    const fetchDocument = async () => {
      setIsLoading(true)

      // In a real app, this would be an API call
      setTimeout(() => {
        // Mock document data
        setDocument({
          id: documentId,
          name: "Project Proposal.docx",
          content: `
            <h1>Project Proposal: Cloud Storage Enhancement</h1>
            <p>Prepared by: CloudStore Team</p>
            <p>Date: March 15, 2025</p>
            <h2>Executive Summary</h2>
            <p>This proposal outlines our plan to enhance the CloudStore platform with advanced document editing and collaboration features. The new functionality will allow users to create, edit, and collaborate on documents directly within the platform, similar to Google Docs.</p>
            <h2>Project Objectives</h2>
            <ul>
              <li>Implement a rich text editor for document creation and editing</li>
              <li>Add real-time collaboration features for shared documents</li>
              <li>Develop a commenting system for document feedback</li>
              <li>Create version history tracking for all documents</li>
            </ul>
            <h2>Timeline and Milestones</h2>
            <p>The project will be completed in three phases:</p>
            <ol>
              <li><strong>Phase 1 (Q2 2025):</strong> Basic document editing functionality</li>
              <li><strong>Phase 2 (Q3 2025):</strong> Real-time collaboration features</li>
              <li><strong>Phase 3 (Q4 2025):</strong> Comments, version history, and advanced formatting</li>
            </ol>
            <h2>Budget</h2>
            <p>The estimated budget for this project is $250,000, broken down as follows:</p>
            <ul>
              <li>Development: $150,000</li>
              <li>Design: $50,000</li>
              <li>Testing and QA: $30,000</li>
              <li>Contingency: $20,000</li>
            </ul>
            <h2>Conclusion</h2>
            <p>By implementing these features, CloudStore will provide a more comprehensive solution for users, reducing the need for external document editing tools and improving the overall user experience.</p>
          `,
          sharedWith: [
            {
              id: "user-1",
              name: "Alex Johnson",
              email: "alex@example.com",
              avatar: "/placeholder.svg?height=40&width=40",
              color: "#2563eb",
            },
            {
              id: "user-2",
              name: "Sarah Williams",
              email: "sarah@example.com",
              avatar: "/placeholder.svg?height=40&width=40",
              color: "#16a34a",
            },
            {
              id: "user-3",
              name: "Michael Brown",
              email: "michael@example.com",
              avatar: "/placeholder.svg?height=40&width=40",
              color: "#ea580c",
            },
          ],
        })
        setIsLoading(false)
      }, 1000)
    }

    if (documentId) {
      fetchDocument()
    }
  }, [documentId])

  const handleSaveDocument = (content: string) => {
    // In a real app, this would save to an API
    console.log("Saving document:", content)

    // Update local state
    if (document) {
      setDocument({
        ...document,
        content,
      })
    }
  }

  const handleBack = () => {
    router.push("/dashboard")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Loading document...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Document not found</h2>
            <p className="mt-2 text-muted-foreground">
              The document you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <button
              className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              onClick={handleBack}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1 overflow-hidden">
        <DocumentEditor
          documentId={document.id}
          documentName={document.name}
          content={document.content}
          onSave={handleSaveDocument}
          onBack={handleBack}
          sharedWith={document.sharedWith}
        />
      </div>
    </div>
  )
}

