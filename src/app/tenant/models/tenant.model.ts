export interface Tenant {
  id?: number;
  name: string;
  country: string;
  state: string;
  city: string;
  short_name: string; // Changed from shortName
  logo_url: string;
  description?: string;
  status: "REGISTERED" | "ACTIVE" | "DEACTIVATED";
  created_at?: string; // Changed from createdAt
  updated_at?: string; // Changed from updatedAt
}
