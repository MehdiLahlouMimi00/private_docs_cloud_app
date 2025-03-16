"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Undo,
  Redo,
  LinkIcon,
  ImageIcon,
  MessageSquare,
  Share2,
  Users,
  History,
  Save,
  ChevronLeft,
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  color: string
}

interface Comment {
  id: string
  user: User
  content: string
  timestamp: string
  resolved: boolean
}

interface DocumentEditorProps {
  documentId: string
  documentName: string
  content?: string
  readOnly?: boolean
  onSave?: (content: string) => void
  onBack?: () => void
  sharedWith?: User[]
}

export function DocumentEditor({
  documentId,
  documentName,
  content = "",
  readOnly = false,
  onSave,
  onBack,
  sharedWith = [],
}: DocumentEditorProps) {
  const [documentContent, setDocumentContent] = useState(content)
  const [documentTitle, setDocumentTitle] = useState(documentName)
  const [activeUsers, setActiveUsers] = useState<User[]>([])
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [selectedText, setSelectedText] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  // Mock current user
  const currentUser: User = {
    id: "current-user",
    name: "You",
    email: "you@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    color: "#7c3aed", // primary color
  }

  // Simulate active users (in a real app, this would come from a real-time connection)
  useEffect(() => {
    if (sharedWith && sharedWith.length > 0) {
      // Randomly select 1-3 users to be "active"
      const numActive = Math.floor(Math.random() * Math.min(3, sharedWith.length)) + 1
      const shuffled = [...sharedWith].sort(() => 0.5 - Math.random())
      setActiveUsers([...shuffled.slice(0, numActive), currentUser])
    } else {
      setActiveUsers([currentUser])
    }
  }, [sharedWith])

  // Simulate comments
  useEffect(() => {
    setComments([
      {
        id: "comment-1",
        user: {
          id: "user-1",
          name: "Alex Johnson",
          email: "alex@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          color: "#2563eb",
        },
        content: "Should we include the Q2 projections here as well?",
        timestamp: "2025-03-15T14:30:00",
        resolved: false,
      },
      {
        id: "comment-2",
        user: {
          id: "user-2",
          name: "Sarah Williams",
          email: "sarah@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          color: "#16a34a",
        },
        content: "The formatting looks good, but we should double-check these numbers.",
        timestamp: "2025-03-15T15:45:00",
        resolved: false,
      },
    ])
  }, [])

  // Handle text selection for commenting
  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && !selection.isCollapsed) {
      setSelectedText(selection.toString())
    } else {
      setSelectedText("")
    }
  }

  // Handle formatting commands
  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value)
  }

  // Handle adding a comment
  const handleAddComment = () => {
    if (newComment.trim() === "") return

    const newCommentObj: Comment = {
      id: `comment-${Date.now()}`,
      user: currentUser,
      content: newComment,
      timestamp: new Date().toISOString(),
      resolved: false,
    }

    setComments([...comments, newCommentObj])
    setNewComment("")
  }

  // Handle resolving a comment
  const handleResolveComment = (commentId: string) => {
    setComments(comments.map((comment) => (comment.id === commentId ? { ...comment, resolved: true } : comment)))
  }

  // Handle saving the document
  const handleSave = () => {
    setIsSaving(true)

    // Simulate saving
    setTimeout(() => {
      if (onSave && editorRef.current) {
        onSave(editorRef.current.innerHTML)
      }
      setIsSaving(false)
      setLastSaved(new Date())
    }, 1000)
  }

  // Format the timestamp for comments
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex h-full flex-col">
      {/* Document header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="size-5" />
          </Button>
          <Input
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="h-9 border-0 text-xl font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
            readOnly={readOnly}
          />
        </div>

        <div className="flex items-center gap-2">
          {lastSaved && (
            <span className="text-sm text-muted-foreground">Last saved {lastSaved.toLocaleTimeString()}</span>
          )}

          <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowComments(!showComments)}>
            <MessageSquare className="size-4" />
            Comments
          </Button>

          <Button variant="outline" size="sm" className="gap-1">
            <Share2 className="size-4" />
            Share
          </Button>

          <div className="flex -space-x-2">
            {activeUsers.slice(0, 3).map((user) => (
              <TooltipProvider key={user.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar
                      className={`size-8 border-2 border-background ${user.id === currentUser.id ? "ring-2 ring-primary" : ""}`}
                    >
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback style={{ backgroundColor: user.color }} className="text-primary-foreground">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{user.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            {activeUsers.length > 3 && (
              <div className="flex size-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                +{activeUsers.length - 3}
              </div>
            )}
          </div>

          <Button onClick={handleSave} disabled={isSaving || readOnly} className="gap-1">
            <Save className="size-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b bg-muted/40 p-1">
        <Tabs defaultValue="format">
          <TabsList className="grid w-full max-w-[400px] grid-cols-3">
            <TabsTrigger value="format">Format</TabsTrigger>
            <TabsTrigger value="insert">Insert</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="format" className="flex flex-wrap gap-1 pt-2">
            <Button variant="ghost" size="icon" onClick={() => handleFormat("bold")} disabled={readOnly}>
              <Bold className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat("italic")} disabled={readOnly}>
              <Italic className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat("underline")} disabled={readOnly}>
              <Underline className="size-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-8" />

            <Button variant="ghost" size="icon" onClick={() => handleFormat("justifyLeft")} disabled={readOnly}>
              <AlignLeft className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat("justifyCenter")} disabled={readOnly}>
              <AlignCenter className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat("justifyRight")} disabled={readOnly}>
              <AlignRight className="size-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-8" />

            <Button variant="ghost" size="icon" onClick={() => handleFormat("insertUnorderedList")} disabled={readOnly}>
              <List className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat("insertOrderedList")} disabled={readOnly}>
              <ListOrdered className="size-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-8" />

            <Button variant="ghost" size="icon" onClick={() => handleFormat("formatBlock", "<h1>")} disabled={readOnly}>
              <Heading1 className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat("formatBlock", "<h2>")} disabled={readOnly}>
              <Heading2 className="size-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-8" />

            <Button variant="ghost" size="icon" onClick={() => handleFormat("undo")} disabled={readOnly}>
              <Undo className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleFormat("redo")} disabled={readOnly}>
              <Redo className="size-4" />
            </Button>
          </TabsContent>

          <TabsContent value="insert" className="flex flex-wrap gap-1 pt-2">
            <Button variant="ghost" size="sm" className="gap-1" disabled={readOnly}>
              <LinkIcon className="size-4" />
              Link
            </Button>
            <Button variant="ghost" size="sm" className="gap-1" disabled={readOnly}>
              <ImageIcon className="size-4" />
              Image
            </Button>
            <Button variant="ghost" size="sm" className="gap-1" disabled={readOnly}>
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
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M8 13h2" />
                <path d="M8 17h2" />
                <path d="M14 13h2" />
                <path d="M14 17h2" />
              </svg>
              Table
            </Button>
            <Button variant="ghost" size="sm" className="gap-1" disabled={readOnly}>
              <MessageSquare className="size-4" />
              Comment
            </Button>
          </TabsContent>

          <TabsContent value="tools" className="flex flex-wrap gap-1 pt-2">
            <Button variant="ghost" size="sm" className="gap-1">
              <History className="size-4" />
              Version history
            </Button>
            <Button variant="ghost" size="sm" className="gap-1">
              <Users className="size-4" />
              Collaborators
            </Button>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Document content */}
        <div
          className="flex-1 overflow-y-auto p-8"
          onClick={handleTextSelection}
          onMouseUp={handleTextSelection}
          onKeyUp={handleTextSelection}
        >
          <div
            ref={editorRef}
            className="min-h-[calc(100vh-250px)] max-w-4xl mx-auto p-4 outline-none"
            contentEditable={!readOnly}
            suppressContentEditableWarning
            dangerouslySetInnerHTML={{ __html: documentContent || "<p>Start typing here...</p>" }}
          />
        </div>

        {/* Comments panel */}
        {showComments && (
          <div className="w-80 border-l bg-card p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Comments</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowComments(false)}>
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
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </Button>
            </div>

            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No comments yet.</p>
              ) : (
                comments
                  .filter((comment) => !comment.resolved)
                  .map((comment) => (
                    <div key={comment.id} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="size-6">
                            <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                            <AvatarFallback
                              style={{ backgroundColor: comment.user.color }}
                              className="text-primary-foreground text-xs"
                            >
                              {comment.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{comment.user.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatTimestamp(comment.timestamp)}</span>
                      </div>
                      <p className="mt-2 text-sm">{comment.content}</p>
                      <div className="mt-2 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleResolveComment(comment.id)}
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                  ))
              )}

              {comments.some((comment) => comment.resolved) && (
                <div className="mt-4">
                  <h4 className="mb-2 text-sm font-medium text-muted-foreground">Resolved</h4>
                  {comments
                    .filter((comment) => comment.resolved)
                    .map((comment) => (
                      <div key={comment.id} className="mb-2 rounded-lg border border-muted p-3 opacity-70">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="size-6">
                              <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                              <AvatarFallback
                                style={{ backgroundColor: comment.user.color }}
                                className="text-primary-foreground text-xs"
                              >
                                {comment.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{comment.user.name}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Resolved
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm">{comment.content}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="mt-4">
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="size-6">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback
                      style={{ backgroundColor: currentUser.color }}
                      className="text-primary-foreground text-xs"
                    >
                      {currentUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">Add a comment</span>
                </div>
                <textarea
                  className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Type your comment here..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={readOnly}
                />
                <div className="mt-2 flex justify-end">
                  <Button size="sm" onClick={handleAddComment} disabled={newComment.trim() === "" || readOnly}>
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

