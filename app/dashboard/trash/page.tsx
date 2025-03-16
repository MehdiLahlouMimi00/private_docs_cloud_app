"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import type { FileType } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { File, FileText, Image, MoreVertical, RefreshCcw, Trash, Trash2 } from "lucide-react"

export default function TrashPage() {
  // Mock deleted files
  const [trashedFiles, setTrashedFiles] = useState<FileType[]>([
    {
      id: "trash-1",
      name: "Old Project.pdf",
      type: "pdf",
      size: "3.2 MB",
      modified: "2025-03-01T14:30:00",
      shared: false,
      starred: false,
      deletedAt: "2025-03-10T09:15:00",
    },
    {
      id: "trash-2",
      name: "Screenshot.jpg",
      type: "image",
      size: "1.8 MB",
      modified: "2025-02-28T11:20:00",
      shared: false,
      starred: false,
      deletedAt: "2025-03-09T16:45:00",
    },
    {
      id: "trash-3",
      name: "Notes.docx",
      type: "document",
      size: "0.5 MB",
      modified: "2025-03-05T10:10:00",
      shared: false,
      starred: false,
      deletedAt: "2025-03-08T13:30:00",
    },
  ])

  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [isEmptyingTrash, setIsEmptyingTrash] = useState(false)

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="size-5 text-accent" />
      case "document":
        return <FileText className="size-5 text-secondary" />
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

  const handleRestore = (fileId: string) => {
    setTrashedFiles((prev) => prev.filter((file) => file.id !== fileId))
    // In a real app, you would move the file back to its original location
  }

  const handlePermanentDelete = (fileId: string) => {
    setTrashedFiles((prev) => prev.filter((file) => file.id !== fileId))
    // In a real app, you would permanently delete the file
  }

  const handleEmptyTrash = () => {
    setTrashedFiles([])
    setIsEmptyingTrash(false)
    // In a real app, you would permanently delete all files
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trash2 className="size-6 text-destructive" />
              <h1 className="text-2xl font-bold">Trash</h1>
            </div>
            <AlertDialog open={isEmptyingTrash} onOpenChange={setIsEmptyingTrash}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={trashedFiles.length === 0}>
                  Empty Trash
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all items in the trash.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleEmptyTrash}>Empty Trash</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Deleted</TableHead>
                  <TableHead className="hidden md:table-cell">Size</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trashedFiles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Trash is empty.
                    </TableCell>
                  </TableRow>
                ) : (
                  trashedFiles.map((file) => (
                    <TableRow
                      key={file.id}
                      className="group cursor-pointer"
                      onClick={() => setSelectedFile(file.id === selectedFile ? null : file.id)}
                    >
                      <TableCell className="p-0 pl-4">{getFileIcon(file.type)}</TableCell>
                      <TableCell className="font-medium">
                        <span className="truncate">{file.name}</span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {formatDate(file.deletedAt || file.modified)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{file.size}</TableCell>
                      <TableCell>
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
                                handleRestore(file.id)
                              }}
                            >
                              <RefreshCcw className="mr-2 size-4" />
                              Restore
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-destructive focus:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                handlePermanentDelete(file.id)
                              }}
                            >
                              <Trash className="mr-2 size-4" />
                              Delete permanently
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            <p>Files in trash will be automatically deleted after 30 days.</p>
          </div>
        </main>
      </div>
    </div>
  )
}

