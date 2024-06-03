// export interface  customer {
// icustomer: any;
    
//     sap_cust_code: string;
//     sap_cust_grp_code: string;
   
//     CostCenter: string;
//     CustName: string;
//     Category: string;   
//     MobileNo: string;
//     PAN: string;
//     City: string;
//     Pincode: string;
//     Location: string;
//     TelNo: string;
//     Address: string;
   
//     CustNameMar: string;
//     AddressMar: string;
//     BillAddressMar: string;
//     EmailId: string;
//     BillingMail: string;
//     Status: string;
//     U_BP_Category: string;
   
//     sap_depot_name: string;
//     sap_create_date?: Date ; // Assuming it's a date or null
//     created_at?: Date; // Assuming it's a date
//     updated_at?: Date; // Assuming it's a date
// }

export interface customer {
   
    sap_cust_code: string;
    sap_cust_grp_code: string;
    cust_grp_code?: string | null;
    CostCenter: string;
    CustName: string;
    Category: string;
    MobileNo: string;
    PAN: string;
    GST_No: string;
    City: string;
    Pincode: string;
    Location: string;
    TelNo: string;
    Address: string;
    ind_type_id?: number | null;
    sap_ind_type: string ;
    CustNameMar: string;
    AddressMar: string;
    BillAddressMar: string;
    BillingMail: string;
    BillingMobileNo: string;
    BiillingPerson: string;
    Status: string;
    depot_id?: string | null;
    sap_depot_name: string;
    sap_create_date?: Date | null;
    CreatedBy:string;
    SalesReference:string;
    created_at: Date;
    updated_at: Date;
}
