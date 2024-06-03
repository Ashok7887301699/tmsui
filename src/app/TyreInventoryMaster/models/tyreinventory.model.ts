export interface Tyreinventory {
    id?: number;
    tyre_code: string;
    tyre_number: string;
    tyre_category: string;
    manufacturer: string;
    tyre_size: string;
    tyre_pattern: string;
    purchase_date: Date;
    qty: number;
    price: number;
    tyre_type: string;
    tyre_position: string;
    tyre_weight: number;
    tyre_status: "Brand New"|"In Use"|"Scrap";
    status: "ACTIVE" | "DEACTIVATED";
    created_at?: string;
    updated_at?: string;
  }
