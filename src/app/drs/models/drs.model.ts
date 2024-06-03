export interface Drs {
  id?: string;
  tenant_id: number;
  dated: string;
  del_depot: string;
  // fleet_vendor_id: string;
  vehicle_model_by_capacity: string;
  vehicle_num: string;
  trip_distance_km_est: number;
  vehicle_meter_reading_trip_start: number;
  vehicle_meter_reading_trip_end: number;
  driver_name: string;
  // driver_mobile: number;
  dl_num: string;
  dl_expiry_datetime: string; // Correct datetime format
  consolidated_ewb_num: string | null;
  trip_start_date: string; // Correct datetime format
  trip_end_date: string; // Correct datetime format
  freight_charges: string;
  status: number;
  cancellation_reason: string;
  pod_datetime: string | null;
  created_by: string;
  pod_received_by: string | null;
  drs_data: DrsData[];
}

export interface DrsData {
  id?: number;
  tenant_id: number;
  drs_id?: string; 
  lr_id: string;
}
