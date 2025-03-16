export interface FileType {
  id: string
  name: string
  type: string
  size: string
  modified: string
  shared: boolean
  starred: boolean
  url?: string
  deletedAt?: string
  content?: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  color?: string
}

