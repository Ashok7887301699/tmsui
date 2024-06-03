export interface Service {
    id?: number;
    contract_id: string;
    load_type: string;
    rate_type: string;
    slab_contract_type: string; // Added a missing colon
    matrices_type: string;
    pickup_delivery_mode: string;
    doc_charges: string;
    excess_weight_chargeable: string; // Added a missing colon
    door_delivery_chargeable: string;
    insurance_chargeable: string;
    status: "REGISTERED" | "ACTIVE" | "DEACTIVATED";
    created_at?: string; // Changed from createdAt
    updated_at?: string; // Changed from updatedAt
  }
  
  
  