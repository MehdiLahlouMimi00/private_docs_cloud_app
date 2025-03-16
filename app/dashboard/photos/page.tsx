"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { FileType } from "@/lib/types"
import { Download, Heart, MoreVertical, Share2, Trash2, ImageIcon } from "lucide-react"

export default function PhotosPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPhoto, setSelectedPhoto] = useState<FileType | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Mock photo data
  const [photos, setPhotos] = useState<FileType[]>([
    {
      id: "photo-1",
      name: "Beach Vacation.jpg",
      type: "image",
      size: "3.2 MB",
      modified: "2025-03-10T14:30:00",
      shared: false,
      starred: true,
      url: "/placeholder.svg?height=400&width=400",
    },
    {
      id: "photo-2",
      name: "Mountain Trip.jpg",
      type: "image",
      size: "2.8 MB",
      modified: "2025-03-09T11:20:00",
      shared: true,
      starred: false,
      url: "/placeholder.svg?height=400&width=400",
    },
    {
      id: "photo-3",
      name: "Family Dinner.jpg",
      type: "image",
      size: "1.9 MB",
      modified: "2025-03-08T16:45:00",
      shared: false,
      starred: false,
      url: "/placeholder.svg?height=400&width=400",
    },
    {
      id: "photo-4",
      name: "Office Party.jpg",
      type: "image",
      size: "2.3 MB",
      modified: "2025-03-07T13:10:00",
      shared: false,
      starred: true,
      url: "/placeholder.svg?height=400&width=400",
    },
    {
      id: "photo-5",
      name: "Project Screenshot.jpg",
      type: "image",
      size: "1.1 MB",
      modified: "2025-03-06T09:30:00",
      shared: true,
      starred: false,
      url: "/placeholder.svg?height=400&width=400",
    },
    {
      id: "photo-6",
      name: "Design Mockup.jpg",
      type: "image",
      size: "2.7 MB",
      modified: "2025-03-05T15:20:00",
      shared: false,
      starred: false,
      url: "/placeholder.svg?height=400&width=400",
    },
  ])

  const filteredPhotos = photos.filter((photo) => {
    if (searchQuery) {
      return photo.name.toLowerCase().includes(searchQuery.toLowerCase())
    }
    return true
  })

  const handleDeletePhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== photoId))
    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto(null)
    }
  }

  const handleStarPhoto = (photoId: string) => {
    setPhotos((prev) => prev.map((photo) => (photo.id === photoId ? { ...photo, starred: !photo.starred } : photo)))
  }

  const handleSharePhoto = (photoId: string) => {
    setPhotos((prev) => prev.map((photo) => (photo.id === photoId ? { ...photo, shared: !photo.shared } : photo)))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="size-6 text-accent" />
              <h1 className="text-2xl font-bold">Photos</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Input
                  type="search"
                  placeholder="Search photos..."
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
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
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
                    className="size-4"
                  >
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
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
                    className="size-4"
                  >
                    <line x1="3" x2="21" y1="6" y2="6" />
                    <line x1="3" x2="21" y1="12" y2="12" />
                    <line x1="3" x2="21" y1="18" y2="18" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="file-grid">
              {filteredPhotos.length === 0 ? (
                <div className="col-span-full py-12 text-center text-muted-foreground">No photos found.</div>
              ) : (
                filteredPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="file-card group bg-card hover:bg-accent/5"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <div className="relative w-full">
                      <Image
                        src={photo.url || "/placeholder.svg?height=200&width=200"}
                        alt={photo.name}
                        width={200}
                        height={200}
                        className="image-thumbnail"
                      />
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="size-7 bg-background/80 backdrop-blur-sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStarPhoto(photo.id)
                          }}
                        >
                          <Heart className={`size-4 ${photo.starred ? "fill-destructive text-destructive" : ""}`} />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="size-7 bg-background/80 backdrop-blur-sm"
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
                                handleSharePhoto(photo.id)
                              }}
                            >
                              <Share2 className="mr-2 size-4" />
                              {photo.shared ? "Manage sharing" : "Share"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-destructive focus:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeletePhoto(photo.id)
                              }}
                            >
                              <Trash2 className="mr-2 size-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="mt-2 w-full text-center">
                      <p className="truncate text-sm font-medium">{photo.name}</p>
                      <p className="text-xs text-muted-foreground">{photo.size}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="rounded-md border bg-card">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left font-medium">Preview</th>
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Date</th>
                    <th className="px-4 py-3 text-left font-medium">Size</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPhotos.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        No photos found.
                      </td>
                    </tr>
                  ) : (
                    filteredPhotos.map((photo) => (
                      <tr
                        key={photo.id}
                        className="group border-b hover:bg-muted/50 cursor-pointer"
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        <td className="px-4 py-3">
                          <div className="size-10 overflow-hidden rounded-md">
                            <Image
                              src={photo.url || "/placeholder.svg?height=40&width=40"}
                              alt={photo.name}
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {photo.name}
                          {photo.shared && <Share2 className="ml-2 inline size-4 text-accent" />}
                          {photo.starred && <Heart className="ml-2 inline size-4 fill-destructive text-destructive" />}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{formatDate(photo.modified)}</td>
                        <td className="px-4 py-3 text-muted-foreground">{photo.size}</td>
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
                                  handleSharePhoto(photo.id)
                                }}
                              >
                                <Share2 className="mr-2 size-4" />
                                {photo.shared ? "Manage sharing" : "Share"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer text-destructive focus:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeletePhoto(photo.id)
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
          )}

          <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
            {selectedPhoto && (
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>{selectedPhoto.name}</DialogTitle>
                  <DialogDescription>
                    {formatDate(selectedPhoto.modified)} • {selectedPhoto.size}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center p-4">
                  <Image
                    src={selectedPhoto.url || "/placeholder.svg?height=600&width=800"}
                    alt={selectedPhoto.name}
                    width={800}
                    height={600}
                    className="max-h-[60vh] w-auto object-contain"
                  />
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" className="gap-2" onClick={() => handleStarPhoto(selectedPhoto.id)}>
                    <Heart className={`size-4 ${selectedPhoto.starred ? "fill-destructive text-destructive" : ""}`} />
                    {selectedPhoto.starred ? "Starred" : "Star"}
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                      <Download className="size-4" />
                      Download
                    </Button>
                    <Button variant="outline" className="gap-2" onClick={() => handleSharePhoto(selectedPhoto.id)}>
                      <Share2 className="size-4" />
                      {selectedPhoto.shared ? "Manage sharing" : "Share"}
                    </Button>
                    <Button
                      variant="destructive"
                      className="gap-2"
                      onClick={() => {
                        handleDeletePhoto(selectedPhoto.id)
                      }}
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </main>
      </div>
    </div>
  )
}

