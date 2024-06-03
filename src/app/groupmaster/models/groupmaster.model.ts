  
 export interface GroupMaster {
    id?: number;
    groupcode: string;
    groupname: string;
    status: "ACTIVE" | "DEACTIVATED";
    created_at?: string; // Changed from createdAt
    updated_at?: string; // Changed from updatedAt
  }
  
