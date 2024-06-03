export interface ContractPaymentType {
  id: number;
  contract_paymenttype: string;
  status: "ACTIVE" | "DEACTIVATED";
  created_at: string;
  updated_at: string;
}
