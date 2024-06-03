export interface India {
    id?: number;
    Country: string;
    state: string;
    district: string;
    taluka: string; 
    postoffice: string;
    post_pincode: string;
    status:  "ACTIVE" | "DEACTIVATED";
    created_at?: string; // Changed from createdAt
    updated_at?: string; // Changed from updatedAt
  }
  