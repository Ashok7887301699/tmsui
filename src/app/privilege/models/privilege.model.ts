 export interface Privilege {
  id?: number;
  name: string;
  description: string;
  status: "ACTIVE" | "DEACTIVATED" | "BLOCKED";
  created_at?: string; // Changed from createdAt
  updated_at?: string; // Changed from updatedAt
}
