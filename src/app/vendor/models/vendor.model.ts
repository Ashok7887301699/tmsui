export interface Vendor {
  id: number;
  VendorCode: string;
  VendorName: string;
  Type: string;
  Address: string;
  City: string;
  Depot: string;
  Vehicle: string;
  Pincode: string;
  Mobile_No: string;
  Email: string;
  PAN_No: string;
  GSTNO: string;
  BankName: string;
  AccountNO: string;
  IFSC: string;
  Category: string;
  U_Location: string;
  status: "ACTIVE" | "DEACTIVATED";
  created_at: string;
  updated_at: string;
}

            