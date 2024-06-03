 
 export interface IndustryType {
    id?: number;
    name: string;
    description: string;
    status: "ACTIVE" | "DEACTIVATED";
    created_at?: string; // Changed from createdAt
    updated_at?: string; // Changed from updatedAt
  }
  

