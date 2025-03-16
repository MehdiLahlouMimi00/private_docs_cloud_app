"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { FileType } from "@/lib/types"
import { cn } from "@/lib/utils"
import {
  Download,
  FileText,
  Image,
  MoreVertical,
  FileSpreadsheet,
  FileIcon as FilePresentation,
  FileIcon as FilePdf,
  File,
  Star,
  Trash2,
  Share2,
  Edit,
} from "lucide-react"

interface FileListProps {
  files: FileType[]
  onDelete: (fileId: string) => void
  onStar: (fileId: string) => void
  onShare: (fileId: string) => void
}

export function FileList({ files, onDelete, onStar, onShare }: FileListProps) {
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="size-5 text-accent" />
      case "document":
        return <FileText className="size-5 text-secondary" />
      case "spreadsheet":
        return <FileSpreadsheet className="size-5 text-emerald-500" />
      case "presentation":
        return <FilePresentation className="size-5 text-orange-500" />
      case "pdf":
        return <FilePdf className="size-5 text-destructive" />
      default:
        return <File className="size-5 text-gray-500" />
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

  const handleFileClick = (file: FileType) => {
    setSelectedFile(file.id === selectedFile ? null : file.id)

    // If it's a document, open the document editor
    if (file.type === "document") {
      router.push(`/dashboard/document/${file.id}`)
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Modified</TableHead>
            <TableHead className="hidden md:table-cell">Size</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No files found.
              </TableCell>
            </TableRow>
          ) : (
            files.map((file) => (
              <TableRow
                key={file.id}
                className={cn("group cursor-pointer", selectedFile === file.id && "bg-muted/50")}
                onClick={() => handleFileClick(file)}
              >
                <TableCell className="p-0 pl-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "size-8",
                      file.starred ? "text-yellow-500" : "text-muted-foreground opacity-0 group-hover:opacity-100",
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      onStar(file.id)
                    }}
                  >
                    <Star className="size-4" />
                  </Button>
                </TableCell>
                <TableCell className="flex items-center gap-2 font-medium">
                  {getFileIcon(file.type)}
                  <span className="truncate">{file.name}</span>
                  {file.shared && <Share2 className="ml-2 size-4 text-accent" />}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {formatDate(file.modified)}
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
                      {file.type === "document" && (
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/dashboard/document/${file.id}`)
                          }}
                        >
                          <Edit className="mr-2 size-4" />
                          Edit
                        </DropdownMenuItem>
                      )}
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
                          onShare(file.id)
                        }}
                      >
                        <Share2 className="mr-2 size-4" />
                        {file.shared ? "Manage sharing" : "Share"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer text-destructive focus:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(file.id)
                        }}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
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
  )
}

