"use client"

import { cn } from "@/lib/utils"

import type React from "react"

import { useState, useRef } from "react"
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
import { Progress } from "@/components/ui/progress"
import type { FileType } from "@/lib/types"
import { Upload, X } from "lucide-react"

interface FileUploaderProps {
  onUpload: (files: FileType[]) => void
}

export function FileUploader({ onUpload }: FileUploaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)
      setSelectedFiles(filesArray)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files)
      setSelectedFiles(filesArray)
    }
  }

  const handleUpload = () => {
    if (selectedFiles.length === 0) return

    setIsUploading(true)

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)

        // Convert selected files to FileType objects
        const uploadedFiles: FileType[] = selectedFiles.map((file, index) => ({
          id: Date.now().toString() + index,
          name: file.name,
          type: getFileType(file.name),
          size: formatFileSize(file.size),
          modified: new Date().toISOString(),
          shared: false,
          starred: false,
        }))

        // Call the onUpload callback with the new files
        onUpload(uploadedFiles)

        // Reset state
        setIsUploading(false)
        setSelectedFiles([])
        setUploadProgress(0)
        setIsOpen(false)
      }
    }, 100)
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const getFileType = (fileName: string): string => {
    const extension = fileName.split(".").pop()?.toLowerCase() || ""

    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) {
      return "image"
    } else if (["doc", "docx", "txt", "rtf"].includes(extension)) {
      return "document"
    } else if (["xls", "xlsx", "csv"].includes(extension)) {
      return "spreadsheet"
    } else if (["ppt", "pptx"].includes(extension)) {
      return "presentation"
    } else if (["pdf"].includes(extension)) {
      return "pdf"
    } else {
      return "other"
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Upload className="size-4" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>Upload files to your cloud storage</DialogDescription>
        </DialogHeader>

        <div
          className={cn(
            "mt-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6",
            isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mb-2 size-8 text-muted-foreground" />
          <p className="mb-1 text-sm font-medium">Drag and drop files here</p>
          <p className="mb-4 text-xs text-muted-foreground">or</p>
          <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
            Browse files
          </Button>
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4 max-h-40 overflow-y-auto">
            <p className="mb-2 text-sm font-medium">Selected files:</p>
            <ul className="space-y-2">
              {selectedFiles.map((file, index) => (
                <li key={index} className="flex items-center justify-between rounded-md border p-2 text-sm">
                  <span className="truncate">{file.name}</span>
                  <Button variant="ghost" size="icon" className="size-6" onClick={() => removeFile(index)}>
                    <X className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isUploading && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Uploading...</span>
              <span className="text-sm">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        <DialogFooter className="mt-4 sm:justify-between">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isUploading}>
            Cancel
          </Button>
          <Button type="button" onClick={handleUpload} disabled={selectedFiles.length === 0 || isUploading}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

