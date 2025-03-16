"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { FileType } from "@/lib/types"
import { Download, File, FileSpreadsheet, FileText, ImageIcon, MoreVertical, Share2, Trash2, Users } from "lucide-react"

interface SharedUser {
  id: string
  name: string
  email: string
  avatar?: string
  permission: "view" | "edit"
}

interface SharedFile extends FileType {
  sharedWith: SharedUser[]
}

export default function SharedPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFile, setSelectedFile] = useState<SharedFile | null>(null)
  const [sharingDialogOpen, setSharingDialogOpen] = useState(false)

  // Mock shared files data
  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>([
    {
      id: "shared-1",
      name: "Q1 Financial Report.pdf",
      type: "pdf",
      size: "3.2 MB",
      modified: "2025-03-10T14:30:00",
      shared: true,
      starred: true,
      sharedWith: [
        {
          id: "user-1",
          name: "Alex Johnson",
          email: "alex@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          permission: "view",
        },
        {
          id: "user-2",
          name: "Sarah Williams",
          email: "sarah@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          permission: "edit",
        },
      ],
    },
    {
      id: "shared-2",
      name: "Project Timeline.xlsx",
      type: "spreadsheet",
      size: "1.8 MB",
      modified: "2025-03-09T11:20:00",
      shared: true,
      starred: false,
      sharedWith: [
        {
          id: "user-3",
          name: "Michael Brown",
          email: "michael@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          permission: "edit",
        },
      ],
    },
    {
      id: "shared-3",
      name: "Team Photo.jpg",
      type: "image",
      size: "2.5 MB",
      modified: "2025-03-08T16:45:00",
      shared: true,
      starred: false,
      url: "/placeholder.svg?height=400&width=400",
      sharedWith: [
        {
          id: "user-1",
          name: "Alex Johnson",
          email: "alex@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          permission: "view",
        },
        {
          id: "user-2",
          name: "Sarah Williams",
          email: "sarah@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          permission: "view",
        },
        {
          id: "user-3",
          name: "Michael Brown",
          email: "michael@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          permission: "view",
        },
      ],
    },
    {
      id: "shared-4",
      name: "Meeting Notes.docx",
      type: "document",
      size: "0.9 MB",
      modified: "2025-03-07T13:10:00",
      shared: true,
      starred: true,
      sharedWith: [
        {
          id: "user-2",
          name: "Sarah Williams",
          email: "sarah@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          permission: "edit",
        },
      ],
    },
  ])

  const filteredFiles = sharedFiles.filter((file) => {
    if (searchQuery) {
      return file.name.toLowerCase().includes(searchQuery.toLowerCase())
    }
    return true
  })

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="size-5 text-accent" />
      case "document":
        return <FileText className="size-5 text-secondary" />
      case "spreadsheet":
        return <FileSpreadsheet className="size-5 text-emerald-500" />
      case "pdf":
        return <File className="size-5 text-destructive" />
      default:
        return <File className="size-5 text-muted-foreground" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleDeleteFile = (fileId: string) => {
    setSharedFiles((prev) => prev.filter((file) => file.id !== fileId))
    if (selectedFile?.id === fileId) {
      setSelectedFile(null)
    }
  }

  const handleUpdatePermission = (fileId: string, userId: string, permission: "view" | "edit") => {
    setSharedFiles((prev) =>
      prev.map((file) => {
        if (file.id === fileId) {
          return {
            ...file,
            sharedWith: file.sharedWith.map((user) => (user.id === userId ? { ...user, permission } : user)),
          }
        }
        return file
      }),
    )

    if (selectedFile?.id === fileId) {
      setSelectedFile((prev) => {
        if (!prev) return null
        return {
          ...prev,
          sharedWith: prev.sharedWith.map((user) => (user.id === userId ? { ...user, permission } : user)),
        }
      })
    }
  }

  const handleRemoveUser = (fileId: string, userId: string) => {
    setSharedFiles((prev) =>
      prev.map((file) => {
        if (file.id === fileId) {
          return {
            ...file,
            sharedWith: file.sharedWith.filter((user) => user.id !== userId),
          }
        }
        return file
      }),
    )

    if (selectedFile?.id === fileId) {
      setSelectedFile((prev) => {
        if (!prev) return null
        return {
          ...prev,
          sharedWith: prev.sharedWith.filter((user) => user.id !== userId),
        }
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 className="size-6 text-primary" />
              <h1 className="text-2xl font-bold">Shared Files</h1>
            </div>
            <div className="relative w-64">
              <Input
                type="search"
                placeholder="Search shared files..."
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
          </div>

          <div className="rounded-md border bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Shared with</th>
                  <th className="px-4 py-3 text-left font-medium">Modified</th>
                  <th className="px-4 py-3 text-left font-medium">Size</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      No shared files found.
                    </td>
                  </tr>
                ) : (
                  filteredFiles.map((file) => (
                    <tr
                      key={file.id}
                      className="group border-b hover:bg-muted/50 cursor-pointer"
                      onClick={() => setSelectedFile(file)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.type)}
                          <span className="font-medium">{file.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex -space-x-2">
                          {file.sharedWith.slice(0, 3).map((user) => (
                            <Avatar key={user.id} className="border-2 border-background size-8">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {file.sharedWith.length > 3 && (
                            <div className="flex size-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                              +{file.sharedWith.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(file.modified)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{file.size}</td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 opacity-0 group-hover:opacity-100"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation()
                                // Download functionality would go here
                              }}
                            >
                              <Download className="mr-2 size-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedFile(file)
                                setSharingDialogOpen(true)
                              }}
                            >
                              <Users className="mr-2 size-4" />
                              Manage sharing
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-destructive focus:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteFile(file.id)
                              }}
                            >
                              <Trash2 className="mr-2 size-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Dialog open={sharingDialogOpen} onOpenChange={setSharingDialogOpen}>
            {selectedFile && (
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share "{selectedFile.name}"</DialogTitle>
                  <DialogDescription>Manage who has access to this file</DialogDescription>
                </DialogHeader>

                <div className="flex items-center space-x-2 py-4">
                  <div className="grid flex-1 gap-2">
                    <Input placeholder="Add people by email" className="w-full" />
                  </div>
                  <Button type="submit">Add</Button>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">People with access</h4>
                  <div className="space-y-4">
                    {selectedFile.sharedWith.map((user) => (
                      <div key={user.id} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            defaultValue={user.permission}
                            onValueChange={(value) =>
                              handleUpdatePermission(selectedFile.id, user.id, value as "view" | "edit")
                            }
                          >
                            <SelectTrigger className="w-[110px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="view">Can view</SelectItem>
                              <SelectItem value="edit">Can edit</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveUser(selectedFile.id, user.id)}
                          >
                            <Trash2 className="size-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <DialogFooter className="sm:justify-start">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
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
                        className="size-4 text-muted-foreground"
                      >
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                      <span className="text-sm text-muted-foreground">Anyone with the link can view</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Copy link
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            )}
          </Dialog>
        </main>
      </div>
    </div>
  )
}

