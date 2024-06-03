export interface Branch {
  BranchCode?: string;
  BranchName: string;
  GSTStateCode: number;
  BranchType: "OWNED" | "CP" | "HUB" | "ONLY DELIVERY" | "ONLY BOOKING";
  Latitude: number;
  Longitude: number;
  Country: string;
  State: string;
  District: string;
  Taluka: string;
  City: string;
  Status: "ACTIVE" | "DEACTIVATED";
  CreatedBy?: number; 
  UploadBranch: string;
  UploadShopAct: string;
  RegionalBranchName: string;
  created_at?: string;
  updated_at?: string;
}