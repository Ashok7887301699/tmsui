export interface VendorFuel {
  id: number;
  PetrolPumpName: string;
  Vendorname: string;
  DVendorCode: string;
  Depot: string;
  status: "ACTIVE" | "DEACTIVATED";
  created_at: string;
  updated_at: string;
}
