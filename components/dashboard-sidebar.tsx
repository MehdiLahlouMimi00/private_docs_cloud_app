"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Clock, FileText, HardDrive, Image, Share2, Star, Trash2, Upload } from "lucide-react"

export function DashboardSidebar() {
  const pathname = usePathname()

  const sidebarItems = [
    { icon: FileText, label: "All Files", href: "/dashboard" },
    { icon: Clock, label: "Recent", href: "/dashboard/recent" },
    { icon: Star, label: "Starred", href: "/dashboard/starred" },
    { icon: Share2, label: "Shared", href: "/dashboard/shared", highlight: true },
    { icon: Image, label: "Photos", href: "/dashboard/photos", highlight: true },
    { icon: Trash2, label: "Trash", href: "/dashboard/trash", highlight: true },
  ]

  return (
    <aside className="hidden w-64 flex-col border-r bg-background p-6 md:flex">
      <div className="mb-8">
        <Button asChild className="w-full justify-start gap-2 bg-secondary hover:bg-secondary/90">
          <Link href="/dashboard/upload">
            <Upload className="size-4" />
            Upload Files
          </Link>
        </Button>
      </div>

      <nav className="flex-1 space-y-1">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : item.highlight
                  ? "text-accent hover:bg-accent/10 hover:text-accent"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-6 pt-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <HardDrive className="size-4" />
              Storage
            </div>
            <span className="text-xs text-muted-foreground">8.5 GB / 10 GB</span>
          </div>
          <Progress value={85} className="h-2" />
        </div>

        <div className="rounded-md border bg-card p-4">
          <h3 className="font-medium">Upgrade Storage</h3>
          <p className="mt-1 text-xs text-muted-foreground">Get more storage space and additional features</p>
          <Button size="sm" className="mt-3 w-full bg-accent hover:bg-accent/90">
            Upgrade Plan
          </Button>
        </div>
      </div>
    </aside>
  )
}

