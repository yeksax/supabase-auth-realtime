export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          author: string | null
          content: string
          created_at: string
          id: number
          reactions: string[]
        }
        Insert: {
          author?: string | null
          content?: string
          created_at?: string
          id?: number
          reactions: string[]
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string
          id?: number
          reactions?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "messages_author_fkey"
            columns: ["author"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
