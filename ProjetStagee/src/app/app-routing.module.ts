import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/dashboard/dashboard.component').then((c) => c.DashboardComponent)
      },
      {
        path: 'dashboardd',
        loadComponent: () => import('./demo/UserBack/dashbordd/dashbordd.component').then((c) => c.DashborddComponent)
      },
      {
        path: 'basic',
        loadChildren: () => import('./demo/ui-elements/ui-basic/ui-basic.module').then((m) => m.UiBasicModule)
      },
      {
        path: 'forms',
        loadChildren: () => import('./demo/pages/form-elements/form-elements.module').then((m) => m.FormElementsModule)
      },
      {
        path: 'tables',
        loadChildren: () => import('./demo/pages/tables/tables.module').then((m) => m.TablesModule)
      },
      {
        path: 'apexchart',
        loadComponent: () => import('./demo/pages/core-chart/apex-chart/apex-chart.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/extra/sample-page/sample-page.component')
      },

      {
        path: 'equipements',
        loadComponent: () => import('./back/equipement-back/equipement-back').then(m => m.EquipementBack)
      },

      {
        path: 'listeusers',
        loadComponent: () => import('./back/user-back/user-back').then(m => m.UserBack)
      }
      ,

      {
        path: 'interventions',
        loadComponent: () => import('./back/intervention-back/intervention-back').then(m => m.InterventionBack)
      }



    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'auth',
        loadComponent: () => import('./demo/UserBack/signin/signin').then(m => m.default)
      },
      {
        path: 'signup',
        loadComponent: () => import('./demo/UserBack/signup/signup').then(m => m.Signup)
      }


    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
