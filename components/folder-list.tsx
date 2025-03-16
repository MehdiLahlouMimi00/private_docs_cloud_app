"use client"

import Link from "next/link"
import { FolderOpen } from "lucide-react"

interface Folder {
  id: string
  name: string
  fileCount: number
}

interface FolderListProps {
  folders: Folder[]
}

export function FolderList({ folders }: FolderListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {folders.map((folder) => (
        <Link
          key={folder.id}
          href={`/dashboard/folder/${folder.id}`}
          className="flex flex-col items-center rounded-lg border p-4 transition-colors hover:bg-muted/50"
        >
          <div className="mb-2 rounded-full bg-primary/10 p-3">
            <FolderOpen className="size-6 text-primary" />
          </div>
          <h3 className="text-center font-medium">{folder.name}</h3>
          <p className="text-sm text-muted-foreground">{folder.fileCount} files</p>
        </Link>
      ))}
    </div>
  )
}

