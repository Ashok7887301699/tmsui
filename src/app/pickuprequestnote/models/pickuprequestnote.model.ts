export interface PickupRequestNote {
  id?: string;
  tenant_id?: number;
  booking_office_id?: number;
  pickupaddress?: string;
  contact_person_name?: string;
  contact_person_mobile1?: string;
  contact_person_mobile2?: string;
  pickup_datetime?: string;
  receiving_depot_id?: number;
  vehicle_model_by_capacity?: string;
  vehicle_num?: string;
  trip_distance_km_est?: number;
  freight_charges?: number;
  vehicle_meter_reading_trip_start?: number;
  vehicle_meter_reading_trip_end?: number;
  driver_vendor_id?: number;
  driver_name?: string;
  dl_num?: string;
  dl_expiry_datetime?: string;
  hamalivendorname?: string;
  hamalivendoramount?: number;
  arrivalhamalivendorname?: string;
  arrivalhamalivendoramount?: number;
  consolidated_ewb_num?: string;
  trip_start_date?: string;
  trip_end_date?: string;
  status?: string;
  cancellation_reason?: string;
  cancellation_date?: string;
  canceled_by?: number;
  depot_arrival_datetime?: string;
  created_by?: string;
  depot_received_by?: string;
  created_at?: string;
  updated_at?: string;

  loader_vendor_id?: string;

  trip_type?: string;
  trip_id?: string;
  action?: string;
  total_labour_charges?: number;

  prn_lr_data?: PrnLrModel[];
}

export interface PrnLrModel {
  id?: string;
  tenant_id?: number;
  prn_id?: string;
  lr_id?: string;
  seq_num?: number;
  created_at?: string;
  updated_at?: string;
  status?: string;
  consignment_location_id?: string;
  total_num_of_pkgs?: number;
  num_of_pkgs?: number;
  remarks?: string;
  state_datetime?: Date;
  state_change_by?: string;
}
