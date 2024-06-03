 
 export interface VehicleCapacityModel {
    id?: number;
    vehcpctmodel: string;
    modeldesc: string;
    status: "ACTIVE" | "DEACTIVATED";
    created_at?: string; // Changed from createdAt
    updated_at?: string; // Changed from updatedAt
  }
  