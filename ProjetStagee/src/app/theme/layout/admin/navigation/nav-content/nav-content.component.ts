import { Component, OnInit, inject, output } from '@angular/core';
import { Location } from '@angular/common';

import { environment } from 'src/environments/environment';
import { NavigationItem, NavigationItems } from '../navigation';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavGroupComponent } from './nav-group/nav-group.component';

@Component({
  selector: 'app-nav-content',
  standalone: true,
  imports: [SharedModule, NavGroupComponent],
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent implements OnInit {
  private location = inject(Location);

  title = 'Demo application for version numbering';
  currentApplicationVersion = environment.appVersion;

  navigations!: NavigationItem[];
  wrapperWidth: number;
  windowWidth = window.innerWidth;

  NavCollapsedMob = output();

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser')!); // 👈 Assure-toi que la clé est bien "currentUser"
    const role = user?.role?.toString().toUpperCase();

    console.log('Utilisateur connecté :', user);
    console.log('Rôle détecté :', role);

    this.navigations = this.filterByRole(NavigationItems, role);
  }

  filterByRole(items: NavigationItem[], role: string): NavigationItem[] {
    return items
      .map(item => {
        if (item.children) {
          const filteredChildren = this.filterByRole(item.children, role);
          if (filteredChildren.length === 0) {
            return null; // 👈 Supprimer le groupe s'il n’a aucun enfant visible
          }
          return { ...item, children: filteredChildren };
        }

        // Si aucun roles défini, visible par tous
        if (!item.roles || item.roles.includes(role)) {
          return item;
        }

        return null;
      })
      .filter(item => item !== null) as NavigationItem[];
  }


  fireOutClick() {
    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent.parentElement.parentElement;
      const last_parent = up_parent.parentElement;
      if (parent.classList.contains('pcoded-hasmenu')) {
        parent.classList.add('pcoded-trigger');
        parent.classList.add('active');
      } else if (up_parent.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('pcoded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('pcoded-trigger');
        last_parent.classList.add('active');
      }
    }
  }
}
