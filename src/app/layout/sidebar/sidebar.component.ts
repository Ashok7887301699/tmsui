import { Component, OnInit } from "@angular/core";
import { UserContextService } from "../../core/services/user-context.service";
import { UserContext } from "../../core/models/user-context.model";
import { ConfigService } from "../../core/config/config.service"; // Import ConfigService
import { MenuItem } from "primeng/api"; // Import MenuItem from PrimeNG


@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  //styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  userContext: UserContext | null = null;
  menuItems: MenuItem[] = []; // Define menuItems


  constructor(
    private userContextService: UserContextService,
    private configService: ConfigService // Inject ConfigService
  ) {}


  ngOnInit(): void {
    this.userContext = this.userContextService.getUserContext();
    this.menuItems = this.configService.sidebarMenu; // Fetch menu items from ConfigService
  }
}