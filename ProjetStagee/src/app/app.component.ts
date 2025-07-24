import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser'; // ✅ Import ici

import { SpinnerComponent } from './theme/shared/components/spinner/spinner.component';

@Component({
  selector: 'app-root',
  imports: [SpinnerComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private titleService = inject(Title); // ✅ Injection du service Title

  title = 'datta-able';

  ngOnInit() {
    this.titleService.setTitle('Dashboard | EY Medical'); // ✅ Titre global

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) return;
      window.scrollTo(0, 0);
    });
  }
}
