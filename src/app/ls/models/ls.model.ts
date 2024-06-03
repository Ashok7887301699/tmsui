export interface ls {
  id?: number;
  tenant_id: number;
  dated: Date;
  del_depot: string;
  from_depot: string;
  to_depot: string;
  freight_charges: number;
  created_by: string;
  cancel_by: string;
  cancellation_reason: string;
  status: string;
  ls_lr_data?: LsLr[];
}

export interface LsLr {
  tenant_id: number;
  drs_id: number;
  thc_id: number;
  ls_id: number;
  lr_id: number;
  seq_num: number;
}