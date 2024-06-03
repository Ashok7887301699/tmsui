export interface Contract {
  id?: number;
  contract_id: string;
  tenant_id: string;
  sap_cust_code: string;
  created_by: string; // Added a missing colon
  start_date: string;
  end_date: string;
  status: "REGISTERED" | "ACTIVE" | "DEACTIVATED";
  created_at?: string; // Changed from createdAt
  updated_at?: string; // Changed from updatedAt
}
