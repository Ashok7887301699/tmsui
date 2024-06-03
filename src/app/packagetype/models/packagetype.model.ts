export interface PackageType {
  id: number;
  package_type: string;
  status: "ACTIVE" | "DEACTIVATED";
  created_at: string;
  updated_at: string;
}
