import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { FormsModule } from "@angular/forms";
import { ToastModule } from "primeng/toast";
import { MenuModule } from "primeng/menu";
import { PanelMenuModule } from "primeng/panelmenu"; // Import PanelMenuModule
import { BreadcrumbModule } from "primeng/breadcrumb";

import { LoginPageHeaderComponent } from "./loginpageheader/login-page-header.component";
import { LoginCardComponent } from "./logincard/login-card.component";
import { LoginPageFooterComponent } from "./loginpagefooter/login-page-footer.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { ContentHeaderComponent } from "./contentheader/content-header.component";
import { ContentFooterComponent } from "./contentfooter/content-footer.component";

@NgModule({
  declarations: [
    LoginPageHeaderComponent,
    LoginCardComponent,
    LoginPageFooterComponent,
    SidebarComponent,
    ContentHeaderComponent,
    ContentFooterComponent,
    // ... any other layout components
  ],
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ToastModule,
    MenuModule,
    PanelMenuModule, // Add PanelMenuModule here
    BreadcrumbModule,
    // ... any other modules these components use
  ],
  providers: [],
  exports: [
    LoginPageHeaderComponent,
    LoginCardComponent,
    LoginPageFooterComponent,
    SidebarComponent,
    ContentHeaderComponent,
    ContentFooterComponent,
    BreadcrumbModule,
    // ... export all components that might be used in other modules
  ],
})
export class LayoutModule {}
