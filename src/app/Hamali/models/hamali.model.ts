export interface Hamali {
  id: number;
  VendorCode: string;
  Hvendor: string;
  DEPOT: string;
  HAccountNO: string;
  HIFSC: string;
  Hbank: string;
  Hbranch: string;
  Category: string;
  U_Location: string;
  status: "ACTIVE" | "DEACTIVATED";
  created_at: string;
  updated_at: string;
}
