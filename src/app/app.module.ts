import { NgModule } from "@angular/core";
import { InputNumberModule } from "primeng/inputnumber";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MessageService } from "primeng/api";
import { FileUploadModule } from "primeng/fileupload";
import { ImageModule } from "primeng/image";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { AccordionModule } from "primeng/accordion"; // Import AccordionModule
import { InputTextModule } from "primeng/inputtext"; // Import InputTextModule
import { CalendarModule } from "primeng/calendar"; // Import CalendarModule

import { ButtonModule } from "primeng/button"; // Import ButtonModule
import { FormsModule } from "@angular/forms"; // Import FormsModule
import { ReactiveFormsModule } from "@angular/forms"; // Import ReactiveFormsModule
import { CardModule } from "primeng/card";
import { FieldsetModule } from "primeng/fieldset";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { StepsModule } from "primeng/steps";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { InputTextareaModule } from "primeng/inputtextarea";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { AppRoutingModule } from "./app-routing.module";
import { CoreModule } from "./core/core.module";
import { LayoutModule } from "./layout/layout.module";
import { LrComponent } from "./lr/lr.component";
import { TenantComponent } from "./tenant/tenant.component";
import { TenantListComponent } from "./tenant/tenant-list.component";
import { TenantDetailComponent } from "./tenant/tenant-detail.component";
import { TenantViewComponent } from "./tenant/tenant-view.component";
import { TenantService } from "./tenant/services/tenant.service";
import { TenantStateService } from "./tenant/services/tenant-state.service";
import { TenantFormComponent } from "./tenant/tenant-form.component";
import { PackagetypeService } from "./packagetype/services/packagetype.service";
import { PackagetypeComponent } from "./packagetype/packagetype.component";
import { PackagetypeListComponent } from "./packagetype/packagetype-list.component";
import { PackagetypeStateService } from "./packagetype/services/packagetype-state.service";
import { PackagetypeFormComponent } from "./packagetype/packagetype-form.component";
import { PackagetypeViewComponent } from "./packagetype/packagetype-view.component";
import { ProducttypeComponent } from "./producttype/producttype.component";
import { ProducttypeFormComponent } from "./producttype/producttype-form.component";
import { ProducttypeListComponent } from "./producttype/producttype-list.component";
import { ProducttypeViewComponent } from "./producttype/producttype-view.component";
import { ProductTypeService } from "./producttype/services/producttype.service";
import { ProductTypeStateService } from "./producttype/services/producttype-state.service";
import { ProducttypeDetailComponent } from "./producttype/producttype-detail.component";
import { PanelModule } from "primeng/panel";
import { CustomerDetailComponent } from "./customer/customer-detail.component";
import { CustomerFormComponent } from "./customer/customer-form.component";
import { CustomerListComponent } from "./customer/customer-list.component";
import { CustomerViewComponent } from "./customer/customer-view.component";
import { CustomerComponent } from "./customer/customer.component";
import { CitymasterComponent } from "./citymaster/citymaster.component";
import { CitymasterDetailComponent } from "./citymaster/citymaster-detail.component";
import { CitymasterListComponent } from "./citymaster/citymaster-list.component";
import { CitymasterViewComponent } from "./citymaster/citymaster-view.component";
import { CitymasterFormComponent } from "./citymaster/citymaster-form.component";
import { CheckboxModule } from "primeng/checkbox";
import { DialogModule } from "primeng/dialog";
import { BranchComponent } from "./branch/branch.component";
import { BranchDetailComponent } from "./branch/branch-detail.component";
import { BranchFormComponent } from "./branch/branch-form.component";
import { BranchListComponent } from "./branch/branch-list.component";
import { BranchViewComponent } from "./branch/branch-view.component";
import { BranchService } from "./branch/services/branch.service";
import { BranchStateService } from "./branch/services/branch-state.service";

import { PackagetypeDetailComponent } from "./packagetype/packagetype-detail.component";
import { ContractPaymentTypeStateService } from "./contractpaymenttype/services/contractpaymenttype-state.service";
import { ContractPaymentTypeService } from "./contractpaymenttype/services/contractpaymenttype.service";
import { ContractPaymentTypeComponent } from "./contractpaymenttype/contractpaymenttype.component";
import { ContractPaymentTypesListComponent } from "./contractpaymenttype/contractpaymenttype-list.component";
import { ContractPaymentTypeFormComponent } from "./contractpaymenttype/contractpaymenttype-form.component";
import { ContractPaymentTypeViewComponent } from "./contractpaymenttype/contractpaymenttype-view.component";
import { ContractPaymentTypeDetailComponent } from "./contractpaymenttype/contractpaymenttype-detail.component";
import { VendorfuelStateService } from "./vendorfuel/services/vendorfuel-state.service";
import { vendorfuelService } from "./vendorfuel/services/vendorfuel.service";
import { VendorfuelListComponent } from "./vendorfuel/vendorfuel-list.component";
import { VendorfuelComponent } from "./vendorfuel/vendorfuel.component";
import { VendorfuelFormComponent } from "./vendorfuel/vendorfuel-form.component";
import { VendorfuelViewComponent } from "./vendorfuel/vendorfuel-view.component";
import { VendorfuelDetailComponent } from "./vendorfuel/vendorfuel-detail.component";

import { ContractListComponent } from "./contract/contract-list.component";
import { ContractComponent } from "./contract/contract.component";
import { ContractFormComponent } from "./contract/contract-form.component";
import { ContractStateService } from "./contract/services/contract-state.service";
import { ContractExcess } from "./contract/contract-excess.component";
import { contractslabrateComponent } from "./contract/contractslabrate.component";
import { contractslabdefinitionsComponent } from "./contract/contractslabdefinitions.component";
import { Serviceselection } from "./contract/Serviceselection-form.component";
import { HamaliService } from "./Hamali/services/hamali.service";
import { HamaliStateService } from "./Hamali/services/hamali-state.service";
import { HamaliComponent } from "./Hamali/hamali.component";
import { HamaliListComponent } from "./Hamali/hamali-list.component";
import { HamaliFormComponent } from "./Hamali/hamali-form.component";
import { HamaliDetailComponent } from "./Hamali/hamali-detail.component";
import { HamaliViewComponent } from "./Hamali/hamali-view.component";
import { RadioButtonModule } from "primeng/radiobutton";
import { DatePipe } from "@angular/common";
import { VehiclecapacitymodelComponent } from "./vehiclecapacitymodel/vehiclecapacitymodel.component";
import { VehiclecapacitymodelViewComponent } from "./vehiclecapacitymodel/vehiclecapacitymodel-view.component";
import { VehiclecapacitymodelListComponent } from "./vehiclecapacitymodel/vehiclecapacitymodel-list.component";
import { VehiclecapacitymodelFormComponent } from "./vehiclecapacitymodel/vehiclecapacitymodel-form.component";
import { VehiclecapacitymodelDetailComponent } from "./vehiclecapacitymodel/vehiclecapacitymodel-detail.component";
import { VehiclecapacitymodelService } from "./vehiclecapacitymodel/services/vehiclecapacitymodel.service";
import { VehiclecapacitymodelStateService } from "./vehiclecapacitymodel/services/vehiclecapacitymodel-state.service";
import { VendorService } from "./vendor/services/vendor.service";
import { VendorStateService } from "./vendor/services/vendor-state.service";
import { VendorComponent } from "./vendor/vendor.component";
import { VendorListComponent } from "./vendor/vendor-list.component";
import { VendorViewComponent } from "./vendor/vendor-view.component";
import { VendorDetailComponent } from "./vendor/vendor-detail.component";
import { VendorFormComponent } from "./vendor/vendor-form.component";
import { DrsComponent } from "./drs/drs.component";
import { DrsService } from "./drs/services/drs.service";
import { DrsStateService } from "./drs/services/drs-state.service";
import { DrsFormComponent } from "./drs/drs-form.component";

import { PickuprequestnoteComponent } from "./pickuprequestnote/pickuprequestnote.component";
import { PickuprequestnoteViewComponent } from "./pickuprequestnote/pickuprequestnote-view.component";
import { PickuprequestnoteListComponent } from "./pickuprequestnote/pickuprequestnote-list.component";
import { PickuprequestnoteFormComponent } from "./pickuprequestnote/pickuprequestnote-form.component";
import { PickuprequestnoteDetailComponent } from "./pickuprequestnote/pickuprequestnote-detail.component";
import { AutoCompleteModule } from "primeng/autocomplete";

import { DriverComponent } from "./drivermaster/driver.component";
import { DriverViewComponent } from "./drivermaster/driver-view.component";
import { DriverDetailComponent } from "./drivermaster/driver-detail.component";
import { DriverFormComponent } from "./drivermaster/driver-form.component";
import { DriverListComponent } from "./drivermaster/driver-list.component";
import { DriverService } from "./drivermaster/services/driver.service";
import { DriverStateService } from "./drivermaster/services/driver-state.service";
import { DropdownModule } from "primeng/dropdown";
import { VehicleDetailComponent } from "./vehicle/vehicle-detail.component";
import { VehicleComponent } from "./vehicle/vehicle.component";
import { VehicleFormComponent } from "./vehicle/vehicle-form.component";
import { VehicleListComponent } from "./vehicle/vehicle-list.component";
import { VehicleViewComponent } from "./vehicle/vehicle-view.component";

import { VehicleService } from "./vehicle/services/vehicle.service";
import { VehicleStateService } from "./vehicle/services/vehicle-state.service";
import { HttpClientModule } from "@angular/common/http";
import { LrService } from "./lr/services/lr.service";
import { LrFormComponent } from "./lr/lr-form.component";
import { LrStateService } from "./lr/services/lr-state.service";
import { RoleComponent } from "./role/role.component";
import { RoleDetailComponent } from "./role/role-detail.component";
import { RoleFormComponent } from "./role/role-form.component";
import { RoleListComponent } from "./role/role-list.component";
import { RoleService } from "./role/services/role.service";
import { RoleViewComponent } from "./role/role-view.component";
import { RoleStateService } from "./role/services/role-state.service";
import { PrivilegeComponent } from "./privilege/privilege.component";
import { PrivilegeDetailComponent } from "./privilege/privilege-detail.component";

import { PrivilegeFormComponent } from "./privilege/privilege-form.component";
import { PrivilegeListComponent } from "./privilege/privilege-list.component";
import { PrivilegeViewComponent } from "./privilege/privilege-view.component";
import { PrivilegeStateService } from "./privilege/services/privilege-state.service";
import { PrivilegeService } from "./privilege/services/privilege.service";
import { contractdoordeliverieComponent } from "./contract/contractdoordeliverie.component";
import { IndustrytypeViewComponent } from "./industrytype/industrytype-view.component";
import { IndustrytypeListComponent } from "./industrytype/industrytype-list.component";
import { IndustrytypeFormComponent } from "./industrytype/industrytype-form.component";
import { IndustrytypeDetailComponent } from "./industrytype/industrytype-detail.component";
import { IndustrytypeComponent } from "./industrytype/industrytype.component";
import { IndustrytypeService } from "./industrytype/services/industrytype.service";
import { IndustrytypeStateService } from "./industrytype/services/industrytype-state.service";
import { GroupmasterViewComponent } from "./groupmaster/groupmaster-view.component";
import { GroupmasterListComponent } from "./groupmaster/groupmaster-list.component";
import { GroupmasterFormComponent } from "./groupmaster/groupmaster-form.component";
import { GroupmasterComponent } from "./groupmaster/groupmaster.component";
import { GroupmasterDetailComponent } from "./groupmaster/groupmaster-detail.component";
import { GroupMasterService } from "./groupmaster/services/groupmaster.service";
import { GroupMasterStateService } from "./groupmaster/services/groupmaster-state.service";
import { VerifypodformComponent } from "./verifypodandvoucher/verifypod-form.component";

import { VerifypodandvoucherComponent } from "./verifypodandvoucher/verifypodandvoucher.component";
import { CustomerCreationComponent } from "./customer/customer-creation.component";
import { ViewlrnumberComponent } from "./viewlrnumber/viewlrnumber.component";

import { LsFormComponent } from "./ls/ls-form.component";
import { LsComponent } from "./ls/ls.component";

import { IndiaComponent } from "./India/india.component";
import { IndiaFormComponent } from "./India/india-form.component";
import { IndiaDetailComponent } from "./India/india-detail.component";
import { IndiaListComponent } from "./India/india-list.component";
import { IndiaViewComponent } from "./India/india-view.component";
import { IndiaService } from "./India/services/india.service";
import { IndiaStateService } from "./India/services/india-state.service";
import { MultiSelectModule } from "primeng/multiselect";
import { UserListComponent } from "./user/user-list.component";
import { UserViewComponent } from "./user/user-view.component";
import { UserFormComponent } from "./user/user-form.component";
import { UserDetailComponent } from "./user/user-detail.component";
import { UserComponent } from "./user/user.component";
import { UserService } from "./user/services/user.service";
import { UserStateService } from "./user/services/user-state.service";

import { PrnDialogContentComponent } from "./pickuprequestnote/prn-dialog-content.component";

import { BranchtypeComponent } from "./branchtype/branchtype.component";
import { BranchtypeViewComponent } from "./branchtype/branchtype-view.component";
import { BranchtypeListComponent } from "./branchtype/branchtype-list.component";
import { BranchtypeFormComponent } from "./branchtype/branchtype-form.component";
import { BranchtypeDetailComponent } from "./branchtype/branchtype-detail.component";

import { TyreinventoryListComponent } from "./TyreInventoryMaster/tyreinventory-list.component";
import { TyreinventoryDetailComponent } from "./TyreInventoryMaster/tyreinventory-detail.component";
import { TyreinventoryViewComponent } from "./TyreInventoryMaster/tyreinventory-view.component";
import { TyreinventoryFormComponent } from "./TyreInventoryMaster/tyreinventory-form.component";
import { TyreinventoryComponent } from "./TyreInventoryMaster/tyreinventory.component";
import { TyreinventoryService } from "./TyreInventoryMaster/services/tyreinventory.service";
import { TyreinventoryStateService } from "./TyreInventoryMaster/services/tyreinventory-state.service";

import { ArrivalprnComponent } from "./pickuprequestnote/arrivalprn.component";
import { UpdatestockarrivalprnComponent } from "./pickuprequestnote/updatestockarrivalprn.component";

@NgModule({
  declarations: [
    ViewlrnumberComponent,
    AppComponent,
    HomeComponent,
    LrComponent,
    TenantComponent,
    TenantListComponent,
    TenantDetailComponent,
    TenantViewComponent,
    TenantFormComponent,
    PackagetypeComponent,
    PackagetypeListComponent,
    PackagetypeFormComponent,
    PackagetypeViewComponent,
    ProducttypeComponent,
    ProducttypeFormComponent,
    ProducttypeListComponent,
    ProducttypeViewComponent,
    ProducttypeDetailComponent,
    CustomerDetailComponent,
    CustomerFormComponent,
    CustomerListComponent,
    CustomerViewComponent,
    CustomerComponent,
    CitymasterComponent,
    CitymasterDetailComponent,
    CitymasterListComponent,
    CitymasterViewComponent,
    CitymasterFormComponent,
    BranchComponent,
    BranchDetailComponent,
    BranchFormComponent,
    BranchListComponent,
    BranchViewComponent,
    PackagetypeDetailComponent,
    ContractPaymentTypeComponent,
    ContractPaymentTypesListComponent,
    ContractPaymentTypeFormComponent,
    ContractPaymentTypeViewComponent,
    ContractPaymentTypeDetailComponent,
    VendorfuelListComponent,
    VendorfuelComponent,
    VendorfuelFormComponent,
    VendorfuelViewComponent,
    VendorfuelDetailComponent,
    // ContractListComponent,
    ContractComponent,
    // ContractFormComponent,
    // Serviceselection,
    Serviceselection,
    ContractFormComponent,
    ContractListComponent,
    ContractExcess,
    HamaliComponent,
    HamaliListComponent,
    HamaliFormComponent,
    HamaliDetailComponent,
    HamaliViewComponent,
    VehiclecapacitymodelComponent,
    VehiclecapacitymodelViewComponent,
    VehiclecapacitymodelListComponent,
    VehiclecapacitymodelFormComponent,
    VehiclecapacitymodelDetailComponent,
    VendorComponent,
    VendorListComponent,
    VendorViewComponent,
    VendorDetailComponent,
    VendorFormComponent,
    DrsComponent,
    DrsFormComponent,
    PickuprequestnoteComponent,
    PickuprequestnoteViewComponent,
    PickuprequestnoteListComponent,
    PickuprequestnoteFormComponent,
    PickuprequestnoteDetailComponent,
    DriverComponent,
    DriverViewComponent,
    DriverDetailComponent,
    DriverFormComponent,
    DriverListComponent,
    VehicleDetailComponent,
    VehicleComponent,
    VehicleFormComponent,
    VehicleListComponent,
    VehicleViewComponent,
    VehicleViewComponent,

    LrFormComponent,
    VehicleViewComponent,
    RoleComponent,
    RoleDetailComponent,
    RoleFormComponent,
    RoleListComponent,
    RoleViewComponent,
    PrivilegeComponent,
    PrivilegeDetailComponent,
    PrivilegeFormComponent,
    PrivilegeListComponent,
    PrivilegeViewComponent,

    PrivilegeDetailComponent,
    RoleViewComponent,
    RoleListComponent,
    RoleFormComponent,
    RoleDetailComponent,
    RoleComponent,
    contractslabrateComponent,
    contractslabdefinitionsComponent,
    IndustrytypeViewComponent,
    IndustrytypeListComponent,
    IndustrytypeFormComponent,
    IndustrytypeDetailComponent,
    IndustrytypeComponent,
    contractdoordeliverieComponent,
    GroupmasterViewComponent,
    GroupmasterListComponent,
    GroupmasterFormComponent,
    GroupmasterComponent,
    GroupmasterDetailComponent,
    contractdoordeliverieComponent,
    VerifypodandvoucherComponent,
    VerifypodformComponent,
    CustomerCreationComponent,
    LsFormComponent,
    LsComponent,

    IndiaComponent,
    IndiaDetailComponent,
    IndiaFormComponent,
    IndiaListComponent,
    IndiaViewComponent,
    UserListComponent,
    UserViewComponent,
    UserFormComponent,
    UserDetailComponent,
    UserComponent,
    PrnDialogContentComponent,

    BranchtypeComponent,
    BranchtypeViewComponent,
    BranchtypeListComponent,
    BranchtypeFormComponent,
    BranchtypeDetailComponent,
    TyreinventoryListComponent,
    TyreinventoryDetailComponent,
    TyreinventoryViewComponent,
    TyreinventoryFormComponent,
    TyreinventoryComponent,

    ArrivalprnComponent,
    UpdatestockarrivalprnComponent,
  ],
  imports: [
    DialogModule,
    BrowserModule,
    DropdownModule,
    CheckboxModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule, // Add FormsModule here
    ReactiveFormsModule, // Add ReactiveFormsModule here
    AppRoutingModule,
    LayoutModule,
    CoreModule,
    TableModule,
    ToastModule,
    AccordionModule, // Add AccordionModule here
    InputTextModule, // Add InputTextModule here
    CalendarModule, // Add CalendarModule here

    ButtonModule, // Add ButtonModule here
    CardModule, // Add this
    FieldsetModule, // And this
    ConfirmDialogModule,
    StepsModule, // Add this for the Steps component
    MessagesModule, // Add this for the Messages component
    // Add this for individual message components
    InputTextareaModule,
    ConfirmDialogModule,
    PanelModule,
    InputNumberModule,
    RadioButtonModule,
    DatePipe,
    CheckboxModule,
    AutoCompleteModule,
    HttpClientModule,
    FileUploadModule,
    ImageModule,
    MultiSelectModule,
  ],
  providers: [
    MessageService,
    TenantService,
    TenantStateService,
    ConfirmationService,
    PackagetypeService,
    PackagetypeStateService,
    ProductTypeService,
    ProductTypeStateService,
    ContractPaymentTypeStateService,
    ContractPaymentTypeService,
    VendorfuelStateService,
    vendorfuelService,
    HamaliService,
    HamaliStateService,
    BranchService,
    BranchStateService,
    ContractStateService,
    DatePipe,
    VehiclecapacitymodelStateService,
    VehiclecapacitymodelService,
    VendorService,
    VendorStateService,
    DrsService,
    DrsStateService,
    DriverService,
    DriverStateService,
    VehicleService,
    VehicleStateService,
    LrService,
    LrStateService,
    VehicleStateService,
    RoleService,
    RoleStateService,
    PrivilegeStateService,
    PrivilegeService,
    PrivilegeStateService,

    RoleStateService,
    RoleService,
    IndustrytypeStateService,
    IndustrytypeService,
    GroupMasterStateService,
    GroupMasterService,
    IndiaService,
    IndiaStateService,
    UserStateService,
    UserService,
    TyreinventoryService,
    TyreinventoryStateService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
