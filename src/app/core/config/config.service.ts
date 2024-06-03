import { Injectable } from "@angular/core";
import { EnvService } from "./env.service";

export interface MenuItem {
  label: string;
  icon?: string;
  items?: MenuItem[];
  routerLink?: string;
}

@Injectable({
  providedIn: "root",
})
export class ConfigService {
  //appContextRoot is for this angular app. It's not yet used anywhere.
  public appContextRoot = "/";

  //Config related to backend APIs.
  public apiContextRoot = "/stapi/v1";
  public apiUrl = this.envService.apiBaseUrl + this.apiContextRoot;
  public authEndPoint = "/userauth/withloginid";
  public authUrl = this.apiUrl + this.authEndPoint;
  public tenantUrl = this.apiUrl + "/tenants";
  public productTypeUrl = this.apiUrl + "/producttype";
  public packagetypeUrl = this.apiUrl + "/packagetype";
  public paymenttypeUrl = this.apiUrl + "/paymenttype";
  public customerUrl = this.apiUrl + "/customers";
  public citymasterUrl = this.apiUrl + "/citymasters";
  public vendorfuelUrl = this.apiUrl + "/vendorfuel";
  public branchUrl = this.apiUrl + "/branch";
  public contractUrl = this.apiUrl + "/Contract";
  public hamaliUrl = this.apiUrl + "/hamali";
  public VehicleCapacityModelUrl = this.apiUrl + "/vehiclecapacitymodel";
  public vendorUrl = this.apiUrl + "/vendor";
  public drsUrl = this.apiUrl + "/drs";
  public pickuprequestnoteUrl = this.apiUrl + "/prn";
  public driverMasterUrl = this.apiUrl + "/drivermaster";
  public vehicleUrl = this.apiUrl+  "/vehicle";
  public lrUrl = this.apiUrl + "/lr";
  public lrdataUrl = this.apiUrl + "/lr/lrdata";
  public fblrdataUrl = this.apiUrl + "/lr/fblrdata";
  public privilegeUrl = this.apiUrl+  "/privilege";
  public roleUrl = this.apiUrl+  "/role";
  public roleprivilegeUrl = this.apiUrl+  "/roleprivilege";
  public userUrl = this.apiUrl+  "/user";
  public IndustrytypeUrl = this.apiUrl+ "/industrytype";
  public GroupMasterUrl = this.apiUrl+ "/groupmaster";
  public lsUrl = this.apiUrl+ "/ls";
  public tyreInventoryUrl = this.apiUrl+ "/tyreinventory";

  public indiaUrl = this.apiUrl+ "/india";
  public BranchtypeUrl = this.apiUrl + "/branchtype";



  // Sidebar menu configuration
  public sidebarMenu: MenuItem[] = [
    { label: "Home", icon: "pi pi-fw pi-home", routerLink: "/home" },
    {
      label: "Freight Booking",
      icon: "pi pi-fw pi-truck",
      items: [{ label: "Lorry Receipt", routerLink: "/fb/lr/create" }],
    },
    {
      label: "Freight Management",
      icon: "pi pi-fw pi-briefcase",
      items: [
        { label: "Pickup Request Note", routerLink: "/fm/prn" },
        { label: "Loading Sheet", routerLink: "/fm/ls" },
        { label: "Trip Hire Challan", routerLink: "/fm/thc" },
        { label: "Delivery Run Sheet", routerLink: "/fm/drs" },
        { label: "Last Mile Delivery", routerLink: "/fm/lmd" },
       
      ],
    },
    {
      label: "Freight Fulfillment",
      icon: "pi pi-fw pi-check-square",
      items: [
        { label: "Proof of Delivery", routerLink: "/ff/pod" },
        { label: "Trip Settlement Voucher", routerLink: "/ff/tsv" },
        { label: "Proof of Delivery Statement", routerLink: "/ff/podstmt" },
      ],
    },
    {
      label: "Freight Intelligence",
      icon: "pi pi-fw pi-chart-line",
      items: [
        { label: "Accounts Receivable", routerLink: "/fi/ar" },
        { label: "Accounts Payable", routerLink: "/fi/ap" },
      ],
    },
    {
      label: "Master Data",
      icon: "pi pi-fw pi-database",
      items: [
        { label: "Tenants Master", routerLink: "/md/tenants" },
        { label: "Customers Master", routerLink: "/md/customers" },
        
        { label: "Vendor Master", routerLink: "/md/vendor" },
        { label: "Hamali Master", routerLink: "/md/hamali" },
        { label: "Vendor Fuel Master", routerLink: "/md/vendorfuel" },
        { label: "Package Type", routerLink: "/md/packagetype" },
        { label: "Product Type", routerLink: "/md/producttype" },
        { label: "City Master", routerLink: "/md/citymasters" },
        { label: "Payment Type", routerLink: "/md/paymenttype" },
        { label: "Branch/Hub Master ", routerLink: "/md/branch" },
        { label: "Contract Master", routerLink: "/md/contract" },
        {
          label: "Vehicle Capacity Model",
          routerLink: "/md/vehiclecapacitymodel",
        },
        { label: "Driver", routerLink: "/md/drivermaster" },
        { label: "Vehicle", routerLink: "/md/vehicle" },
        { label: "Industry Type", routerLink: "/md/industrytype" },
        { label: "Group Master", routerLink: "/md/groupmaster" },
        { label: "India Master", routerLink: "/md/india" },
        { label: "Branch Type Master", routerLink: "/md/branchtype" },
        { label: "Tyre Inventory Master", routerLink: "/md/tyreinventory" },
        

        
      ],
    },
    {
      label: "User Management",
      icon: "pi pi-fw pi-user",
      items: [
        { label: "Add Privilege", routerLink: "/um/privilege" },
        { label: "Add Role", routerLink: "/um/role" },

        { label: "Create New User", routerLink: "/um/user" },


      ],
    },
    
  ];

  constructor(private envService: EnvService) {}
}
