import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";
import { HomeComponent } from "./home/home.component";
import { LrComponent } from "./lr/lr.component";
import { LrFormComponent } from "./lr/lr-form.component";
import { TenantComponent } from "./tenant/tenant.component";
import { TenantListComponent } from "./tenant/tenant-list.component";
import { TenantViewComponent } from "./tenant/tenant-view.component";
import { TenantFormComponent } from "./tenant/tenant-form.component";
import { PackagetypeListComponent } from "./packagetype/packagetype-list.component";
import { PackagetypeComponent } from "./packagetype/packagetype.component";
import { PackagetypeFormComponent } from "./packagetype/packagetype-form.component";
import { PackagetypeViewComponent } from "./packagetype/packagetype-view.component";
import { ProducttypeComponent } from "./producttype/producttype.component";
import { ProducttypeListComponent } from "./producttype/producttype-list.component";
import { ProducttypeFormComponent } from "./producttype/producttype-form.component";
import { ProducttypeViewComponent } from "./producttype/producttype-view.component";
import { CitymasterComponent } from "./citymaster/citymaster.component";
import { CitymasterFormComponent } from "./citymaster/citymaster-form.component";
import { CitymasterListComponent } from "./citymaster/citymaster-list.component";
import { CitymasterViewComponent } from "./citymaster/citymaster-view.component";
import { BranchComponent } from "./branch/branch.component";
import { BranchListComponent } from "./branch/branch-list.component";
import { BranchViewComponent } from "./branch/branch-view.component";
import { BranchFormComponent } from "./branch/branch-form.component";
import { CustomerListComponent } from "./customer/customer-list.component";
import { CustomerViewComponent } from "./customer/customer-view.component";
import { CustomerFormComponent } from "./customer/customer-form.component";
import { ContractPaymentTypesListComponent } from "./contractpaymenttype/contractpaymenttype-list.component";
import { ContractPaymentTypeFormComponent } from "./contractpaymenttype/contractpaymenttype-form.component";
import { ContractPaymentTypeViewComponent } from "./contractpaymenttype/contractpaymenttype-view.component";
import { VendorfuelListComponent } from "./vendorfuel/vendorfuel-list.component";
import { VendorfuelComponent } from "./vendorfuel/vendorfuel.component";
import { VendorfuelFormComponent } from "./vendorfuel/vendorfuel-form.component";
import { VendorfuelViewComponent } from "./vendorfuel/vendorfuel-view.component";
import { ContractListComponent } from "./contract/contract-list.component";
import { ContractComponent } from "./contract/contract.component";
import { ContractExcess } from "./contract/contract-excess.component";
import { ContractFormComponent } from "./contract/contract-form.component";
import { contractslabrateComponent } from "./contract/contractslabrate.component";
import { contractslabdefinitionsComponent } from "./contract/contractslabdefinitions.component";
import { contractdoordeliverieComponent } from "./contract/contractdoordeliverie.component";
import { Serviceselection } from "./contract/Serviceselection-form.component";
import { HamaliComponent } from "./Hamali/hamali.component";
import { HamaliListComponent } from "./Hamali/hamali-list.component";
import { HamaliFormComponent } from "./Hamali/hamali-form.component";
import { HamaliViewComponent } from "./Hamali/hamali-view.component";
import { VehiclecapacitymodelComponent } from "./vehiclecapacitymodel/vehiclecapacitymodel.component";
import { VehiclecapacitymodelListComponent } from "./vehiclecapacitymodel/vehiclecapacitymodel-list.component";
import { VehiclecapacitymodelFormComponent } from "./vehiclecapacitymodel/vehiclecapacitymodel-form.component";
import { VehiclecapacitymodelViewComponent } from "./vehiclecapacitymodel/vehiclecapacitymodel-view.component";
import { VendorComponent } from "./vendor/vendor.component";
import { VendorListComponent } from "./vendor/vendor-list.component";
import { VendorViewComponent } from "./vendor/vendor-view.component";
import { VendorFormComponent } from "./vendor/vendor-form.component";
import { DrsComponent } from "./drs/drs.component";
import { DrsFormComponent } from "./drs/drs-form.component";
import { PickuprequestnoteComponent } from "./pickuprequestnote/pickuprequestnote.component";
import { PickuprequestnoteViewComponent } from "./pickuprequestnote/pickuprequestnote-view.component";
import { PickuprequestnoteListComponent } from "./pickuprequestnote/pickuprequestnote-list.component";
import { PickuprequestnoteFormComponent } from "./pickuprequestnote/pickuprequestnote-form.component";
import { DriverComponent } from "./drivermaster/driver.component";
import { DriverViewComponent } from "./drivermaster/driver-view.component";
import { DriverFormComponent } from "./drivermaster/driver-form.component";
import { DriverListComponent } from "./drivermaster/driver-list.component";
import { VehicleComponent } from "./vehicle/vehicle.component";
import { VehicleViewComponent } from "./vehicle/vehicle-view.component";
import { VehicleListComponent } from "./vehicle/vehicle-list.component";
import { VehicleFormComponent } from "./vehicle/vehicle-form.component";
import { PrivilegeComponent } from "./privilege/privilege.component";
import { PrivilegeFormComponent } from "./privilege/privilege-form.component";
import { PrivilegeViewComponent } from "./privilege/privilege-view.component";
import { PrivilegeListComponent } from "./privilege/privilege-list.component";
import { RoleComponent } from "./role/role.component";
import { RoleFormComponent } from "./role/role-form.component";
import { RoleListComponent } from "./role/role-list.component";
import { RoleViewComponent } from "./role/role-view.component";
import { CustomerComponent } from "./customer/customer.component";
import { IndustrytypeComponent } from "./industrytype/industrytype.component";
import { IndustrytypeListComponent } from "./industrytype/industrytype-list.component";
import { IndustrytypeFormComponent } from "./industrytype/industrytype-form.component";
import { IndustrytypeViewComponent } from "./industrytype/industrytype-view.component";
import { GroupmasterComponent } from "./groupmaster/groupmaster.component";
import { GroupmasterListComponent } from "./groupmaster/groupmaster-list.component";
import { GroupmasterFormComponent } from "./groupmaster/groupmaster-form.component";
import { GroupmasterViewComponent } from "./groupmaster/groupmaster-view.component";
import { CustomerCreationComponent } from "./customer/customer-creation.component";
import { ViewlrnumberComponent } from "./viewlrnumber/viewlrnumber.component";
import { VerifypodandvoucherComponent } from "./verifypodandvoucher/verifypodandvoucher.component";
import { VerifypodformComponent } from "./verifypodandvoucher/verifypod-form.component";
import { LsFormComponent } from "./ls/ls-form.component";
import { LsComponent } from "./ls/ls.component";


import { IndiaFormComponent } from "./India/india-form.component";
import { IndiaListComponent } from "./India/india-list.component";
import { IndiaViewComponent } from "./India/india-view.component";
import { IndiaComponent } from "./India/india.component";

import { UserComponent } from "./user/user.component";
import { UserFormComponent } from "./user/user-form.component";
import { UserListComponent } from "./user/user-list.component";
import { UserViewComponent } from "./user/user-view.component";

import { BranchtypeComponent } from "./branchtype/branchtype.component";
import { BranchtypeListComponent } from "./branchtype/branchtype-list.component";
import { BranchtypeViewComponent } from "./branchtype/branchtype-view.component";
import { BranchtypeFormComponent } from "./branchtype/branchtype-form.component";

import { TyreinventoryComponent } from "./TyreInventoryMaster/tyreinventory.component";
import { TyreinventoryFormComponent } from "./TyreInventoryMaster/tyreinventory-form.component";
import { TyreinventoryListComponent } from "./TyreInventoryMaster/tyreinventory-list.component";
import { TyreinventoryViewComponent } from "./TyreInventoryMaster/tyreinventory-view.component";

import { ArrivalprnComponent } from "./pickuprequestnote/arrivalprn.component";

import { UpdatestockarrivalprnComponent } from "./pickuprequestnote/updatestockarrivalprn.component";

const routes: Routes = [
  { path: "home", component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: "fb/lr",
    component: LrComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "create", component: LrFormComponent },
      { path: "create/viewlrnumber", component: ViewlrnumberComponent },
    ],
  },
  {
    path: "md/tenants",
    component: TenantComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", component: TenantListComponent },
      { path: "view/:id", component: TenantViewComponent },
      { path: "create", component: TenantFormComponent },
      { path: "edit/:id", component: TenantFormComponent },
    ],
  },
  {
    path: "md/contract",
    component: ContractComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", component: ContractListComponent },
      { path: "view/:id", component: ContractFormComponent },
      { path: "create", component: ContractFormComponent },
      { path: "edit/:id", component: ContractFormComponent },
      { path: "contractslabrate", component: contractslabrateComponent },
      {path: "contractslabdefinitions",component: contractslabdefinitionsComponent},
      { path: "ContractExcess", component: ContractExcess },
      { path: "Serviceselection", component: Serviceselection },

    ],
  },
  {
    path: "md/citymasters",
    component: CitymasterComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", component: CitymasterListComponent },
      { path: "view/:id", component: CitymasterViewComponent },
      { path: "create", component: CitymasterFormComponent },
      { path: "edit/:id", component: CitymasterFormComponent },
    ],
  },

  {
    path: "md/packagetype",
    component: PackagetypeComponent,
    canActivate: [AuthGuard],
    children: [
      // Nested routes under 'md/packagetype'
      { path: "", component: PackagetypeListComponent },
      { path: "view/:id", component: PackagetypeViewComponent },
      { path: "create", component: PackagetypeFormComponent }, // New route for create
      { path: "edit/:id", component: PackagetypeFormComponent }, // New route for edit
    ],
  },
  {
    path: "md/producttype",
    component: ProducttypeComponent,
    canActivate: [AuthGuard],
    children: [
      // Nested routes under 'md/producttype'
      { path: "", component: ProducttypeListComponent },
      { path: "view/:id", component: ProducttypeViewComponent },
      { path: "create", component: ProducttypeFormComponent }, // New route for create
      { path: "edit/:id", component: ProducttypeFormComponent }, // New route for edit
    ],
  },
  {
    path: "md/paymenttype",
    component: PackagetypeComponent,
    canActivate: [AuthGuard],
    children: [
      // Nested routes under 'md/payments'
      { path: "", component: ContractPaymentTypesListComponent },
      { path: "view/:id", component: ContractPaymentTypeViewComponent },
      { path: "create", component: ContractPaymentTypeFormComponent }, // New route for create
      { path: "edit/:id", component: ContractPaymentTypeFormComponent }, // New route for edit
    ],
  },

  {
    path: "md/customers",
    component: CustomerComponent,
    canActivate: [AuthGuard],
    children: [
      // Nested routes under 'md/producttype'
      { path: "list", component: CustomerListComponent },
      { path: "", component: CustomerCreationComponent },

      { path: "view/:sap_cust_code", component: CustomerViewComponent },
      { path: "create", component: CustomerFormComponent }, // New route for create
      { path: "edit/:sap_cust_code", component: CustomerFormComponent }, // New route for edit
    ],
  },
  {
    path: "md/vendorfuel",
    component: VendorfuelComponent,
    canActivate: [AuthGuard],
    children: [
      // Nested routes under 'md/payments'
      { path: "", component: VendorfuelListComponent },
      { path: "view/:id", component: VendorfuelViewComponent },
      { path: "create", component: VendorfuelFormComponent }, // New route for create
      { path: "edit/:id", component: VendorfuelFormComponent }, // New route for edit
    ],
  },

  {
    path: "md/branch",
    component: BranchComponent,
    canActivate: [AuthGuard],
    children: [
      // Nested routes under 'md/branch'
      { path: "", component: BranchListComponent },
      { path: "view/:branchCode", component: BranchViewComponent },
      { path: "create", component: BranchFormComponent }, // New route for create
      { path: "edit/:branchCode", component: BranchFormComponent }, // New route for edit
    ],
  },
  {
    path: "md/hamali",
    component: HamaliComponent,
    canActivate: [AuthGuard],
    children: [
      // Nested routes under 'md/payments'
      { path: "", component: HamaliListComponent },
      { path: "view/:id", component: HamaliViewComponent },
      { path: "create", component: HamaliFormComponent }, // New route for create
      { path: "edit/:id", component: HamaliFormComponent }, // New route for edit
    ],
  },
  {
    path: "md/vehiclecapacitymodel",
    component: VehiclecapacitymodelComponent,
    canActivate: [AuthGuard],
    children: [
      // Nested routes under 'md/vehiclecapacitymodel'
      { path: "", component: VehiclecapacitymodelListComponent },
      { path: "view/:id", component: VehiclecapacitymodelViewComponent },
      { path: "create", component: VehiclecapacitymodelFormComponent }, // New route for create
      { path: "edit/:id", component: VehiclecapacitymodelFormComponent }, // New route for edit
    ],
  },

  {
    path: "md/vendor",
    component: VendorComponent,
    canActivate: [AuthGuard],
    children: [
      // Nested routes under 'md/payments'
      { path: "", component: VendorListComponent },
      { path: "view/:id", component: VendorViewComponent },
      { path: "create", component: VendorFormComponent }, // New route for create
      { path: "edit/:id", component: VendorFormComponent }, // New route for edit
    ],
  },

  {
    path: "fm/drs",
    component: DrsComponent,
    canActivate: [AuthGuard],
    children: [
      // Nested routes under 'md/payments'
      // { path: "", component: VendorListComponent },
      // { path: "view/:id", component: VendorViewComponent },
      { path: "create", component: DrsFormComponent }, // New route for create
      // { path: "edit/:id", component: VendorFormComponent }, // New route for edit
    ],
  },

  {
    path: "fm/prn",
    component: PickuprequestnoteComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", component: PickuprequestnoteListComponent },
      { path: "view/:id", component: PickuprequestnoteViewComponent },
      { path: "create", component: PickuprequestnoteFormComponent },
      { path: "edit/:id", component: PickuprequestnoteFormComponent },
      { path: "arrivalprn", component: ArrivalprnComponent },
      {
        path: "updatestockarrivalprn/:prnId", // Define the route with prnId parameter
        component: UpdatestockarrivalprnComponent,
      },
    ],
  },

  {
    path: "md/drivermaster",
    component: DriverComponent,
    canActivate: [AuthGuard],
    children: [
      // Nested routes under 'md/tenants'
      { path: "", component: DriverListComponent },
      { path: "view/:id", component: DriverViewComponent },
      { path: "create", component: DriverFormComponent }, // still working
      { path: "edit/:id", component: DriverFormComponent },
    ],
  },
  {
    path: "md/vehicle",
    component: VehicleComponent,
    canActivate: [AuthGuard],
    children: [
      // Nested routes under 'md/payments'
      { path: "", component: VehicleListComponent },
      { path: "view/:SrNo", component: VehicleViewComponent },
      { path: "create", component: VehicleFormComponent }, // New route for create
      { path: "edit/:SrNo", component: VehicleFormComponent }, // New route for edit
    ],
  },

  {
    path: "um/privilege",
    component: PrivilegeComponent,
    canActivate: [AuthGuard],
    children: [
      // Nested routes under 'um/privilege'
      { path: "", component: PrivilegeListComponent },
      { path: "view/:id", component: PrivilegeViewComponent },
      { path: "create", component: PrivilegeFormComponent }, // New route for create
      { path: "edit/:id", component: PrivilegeFormComponent }, // New route for edit
    ],
  },

  {
    path: "um/role",
    component: RoleComponent,
    canActivate: [AuthGuard],
    children: [
      // Nested routes under 'um/role'
      { path: "", component: RoleListComponent },
      { path: "view/:id", component: RoleViewComponent },
      { path: "create", component: RoleFormComponent }, // New route for create
      { path: "edit/:id", component: RoleFormComponent }, // New route for edit
    ],
  },

  {
    path: "um/user",
    component: UserComponent,
    canActivate: [AuthGuard],
    children: [
      // Nested routes under 'um/user'
      { path: "", component: UserListComponent },
      { path: "view/:id", component: UserViewComponent },
      { path: "create", component: UserFormComponent }, // New route for create
      { path: "edit/:id", component: UserFormComponent }, // New route for edit
    ],
  },

  {
    path: "md/industrytype",
    component: IndustrytypeComponent,
    canActivate: [AuthGuard],
    children: [
      // Nested routes under 'md/industrytype'
      { path: "", component: IndustrytypeListComponent },
      { path: "view/:id", component: IndustrytypeViewComponent },
      { path: "create", component: IndustrytypeFormComponent }, // New route for create
      { path: "edit/:id", component: IndustrytypeFormComponent }, // New route for edit
    ],
  },

  {
    path: "md/groupmaster",
    component: GroupmasterComponent,
    canActivate: [AuthGuard],
    children: [
      // Nested routes under 'md/groupmaster'
      { path: "", component: GroupmasterListComponent },
      { path: "view/:id", component: GroupmasterViewComponent },
      { path: "create", component: GroupmasterFormComponent }, // New route for create
      { path: "edit/:id", component: GroupmasterFormComponent }, // New route for edit
    ],
  },

  {
    path: "md/pod",
    component: VerifypodandvoucherComponent,
    canActivate: [AuthGuard],
    children: [
      // Nested routes under 'md/industrytype'
      { path: "", component: VerifypodformComponent },
    ],
  },

  {
    path: "fm/ls",
    component: LsComponent,
    canActivate: [AuthGuard],
    children: [
      // Nested routes under 'md/industrytype'
      { path: "create", component: LsFormComponent },
    ],
  },

  {
    path: "md/india",
    component: IndiaComponent,
    canActivate: [AuthGuard],
    children: [
      // Nested routes under 'md/tenants'
      { path: "", component: IndiaListComponent },
      { path: "view/:id", component: IndiaViewComponent },
      { path: "create", component: IndiaFormComponent }, // still working
      { path: "edit/:id", component: IndiaFormComponent },
    ],
  },
  {
    path: "md/tyreinventory",
    component: TyreinventoryComponent,
    canActivate: [AuthGuard],
    children: [
      // Nested routes under 'md/tenants'
      { path: "", component: TyreinventoryListComponent },
      { path: "view/:id", component: TyreinventoryViewComponent },
      { path: "create", component: TyreinventoryFormComponent }, // still working
      { path: "edit/:id", component: TyreinventoryFormComponent },
    ],
  },

  {
    path: "md/branchtype",
    component: BranchtypeComponent,
    canActivate: [AuthGuard],
    children: [
      // Nested routes under 'md/tenants'
      { path: "", component: BranchtypeListComponent },
      { path: "view/:id", component: BranchtypeViewComponent },
      { path: "create", component: BranchtypeFormComponent }, // still working
      { path: "edit/:id", component: BranchtypeFormComponent },
    ],
  },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
