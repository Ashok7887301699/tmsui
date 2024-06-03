// Right now, it is dead code. We can remove it at some point of time.

import { Injectable } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { MenuItem } from "primeng/api";
import { filter } from "rxjs/operators";
import { ConfigService } from "./config.service"; // Import ConfigService

@Injectable({
  providedIn: "root",
})
export class BreadcrumbService {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private configService: ConfigService // Inject ConfigService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Rebuild breadcrumbs on each navigation end
        this.createBreadcrumbs(this.activatedRoute.root);
      });
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = "",
    breadcrumbs: MenuItem[] = []
  ): MenuItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join("/");
      if (routeURL !== "") {
        url += `/${routeURL}`;

        // Find matching item in the sidebar menu
        const matchingItem = this.findMatchingMenuItem(url);
        if (matchingItem) {
          breadcrumbs.push({
            label: matchingItem.label,
            icon: matchingItem.icon,
            routerLink: url,
          });
        }
      }
      breadcrumbs = this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  // Find a matching item in the sidebarMenu based on the URL
  private findMatchingMenuItem(url: string): MenuItem | undefined {
    const flattenItems = (items: MenuItem[]): MenuItem[] => {
      return items.reduce(
        (acc, item) => [
          ...acc,
          item,
          ...(item.items ? flattenItems(item.items) : []),
        ],
        [] as MenuItem[]
      );
    };

    const allMenuItems = flattenItems(this.configService.sidebarMenu);
    return allMenuItems.find((item) => item.routerLink === url);
  }

  getCurrentBreadcrumbs(): MenuItem[] {
    return this.createBreadcrumbs(this.activatedRoute.root);
  }
}
