export interface User {
  id: number;
  tenant_id: number;
  login_id: string;
  mobile_no: string;
  email_id: string;
  password_hash: string;
  displayname: string;
  profile_pic_url?: string;
  user_type: string;
  role_id: number;
  status: "ACTIVE" | "DEACTIVATED";
  created_at?: string;
  updated_at?: string;
  // appliedBranchCode: Branch[];
  branch_code: string;
  [key: string]: any; // Index signature 
}