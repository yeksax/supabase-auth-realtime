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
      User: {
        Row: {
          createdAt: string
          email: string
          id: number
          name: string
          password: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email: string
          id?: number
          name: string
          password: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          email?: string
          id?: number
          name?: string
          password?: string
          updatedAt?: string
        }
        Relationships: []
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
