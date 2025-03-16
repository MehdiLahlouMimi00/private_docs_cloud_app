"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUploader } from "@/components/file-uploader"
import { FileList } from "@/components/file-list"
import { FolderList } from "@/components/folder-list"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import type { FileType } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FilePlus } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [newDocName, setNewDocName] = useState("")
  const [isCreatingDoc, setIsCreatingDoc] = useState(false)

  // Mock data for files
  const [files, setFiles] = useState<FileType[]>([
    {
      id: "1",
      name: "Project Proposal.docx",
      type: "document",
      size: "0.9 MB",
      modified: "2025-03-10T14:30:00",
      shared: true,
      starred: true,
    },
    {
      id: "2",
      name: "Budget Spreadsheet.xlsx",
      type: "spreadsheet",
      size: "1.8 MB",
      modified: "2025-03-12T09:15:00",
      shared: true,
      starred: false,
    },
    {
      id: "3",
      name: "Team Photo.jpg",
      type: "image",
      size: "3.2 MB",
      modified: "2025-03-14T16:45:00",
      shared: false,
      starred: false,
    },
    {
      id: "4",
      name: "Presentation.pptx",
      type: "presentation",
      size: "5.7 MB",
      modified: "2025-03-15T11:20:00",
      shared: true,
      starred: true,
    },
    {
      id: "5",
      name: "Meeting Notes.docx",
      type: "document",
      size: "0.9 MB",
      modified: "2025-03-15T13:10:00",
      shared: false,
      starred: false,
    },
  ])

  // Mock data for folders
  const folders = [
    { id: "1", name: "Documents", fileCount: 12 },
    { id: "2", name: "Images", fileCount: 24 },
    { id: "3", name: "Projects", fileCount: 8 },
    { id: "4", name: "Shared with me", fileCount: 5 },
  ]

  const handleFileUpload = (newFiles: FileType[]) => {
    setFiles((prevFiles) => [...newFiles, ...prevFiles])
  }

  const handleDeleteFile = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId))
  }

  const handleStarFile = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.map((file) => (file.id === fileId ? { ...file, starred: !file.starred } : file)))
  }

  const handleShareFile = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.map((file) => (file.id === fileId ? { ...file, shared: !file.shared } : file)))
  }

  const handleCreateDocument = () => {
    if (!newDocName.trim()) return

    setIsCreatingDoc(true)

    // Simulate creating a new document
    setTimeout(() => {
      const newDoc: FileType = {
        id: `doc-${Date.now()}`,
        name: newDocName.endsWith(".docx") ? newDocName : `${newDocName}.docx`,
        type: "document",
        size: "0.1 MB",
        modified: new Date().toISOString(),
        shared: false,
        starred: false,
      }

      setFiles((prev) => [newDoc, ...prev])
      setNewDocName("")
      setIsCreatingDoc(false)

      // Navigate to the new document
      router.push(`/dashboard/document/${newDoc.id}`)
    }, 1000)
  }

  const filteredFiles = files.filter((file) => {
    if (searchQuery) {
      return file.name.toLowerCase().includes(searchQuery.toLowerCase())
    }

    if (activeTab === "starred") {
      return file.starred
    }

    if (activeTab === "shared") {
      return file.shared
    }

    return true
  })

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">My Files</h1>
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Input
                  type="search"
                  placeholder="Search files..."
                  className="pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute right-3 top-1/2 size-4 -translate-y-1/2 transform text-muted-foreground"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <FilePlus className="size-4" />
                    New Document
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Document</DialogTitle>
                    <DialogDescription>Enter a name for your new document</DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Input
                      placeholder="Document name"
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateDocument} disabled={!newDocName.trim() || isCreatingDoc}>
                      {isCreatingDoc ? "Creating..." : "Create Document"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <FileUploader onUpload={handleFileUpload} />
            </div>
          </div>

          <div className="mb-8">
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Files</TabsTrigger>
                <TabsTrigger value="starred">Starred</TabsTrigger>
                <TabsTrigger value="shared">Shared</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold">Folders</h2>
            <FolderList folders={folders} />
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold">Recent Files</h2>
            <FileList
              files={filteredFiles}
              onDelete={handleDeleteFile}
              onStar={handleStarFile}
              onShare={handleShareFile}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

