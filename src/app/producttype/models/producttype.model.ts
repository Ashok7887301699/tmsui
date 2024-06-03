 export interface ProductType {
    id?: number;
    product_type: string;
    status: "ACTIVE" | "DEACTIVATED";
    created_at?: string; // Changed from createdAt
    updated_at?: string; // Changed from updatedAt
  }
  