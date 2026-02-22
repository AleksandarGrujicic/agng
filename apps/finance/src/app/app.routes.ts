import { Routes } from '@angular/router';
import { LayoutComponent } from '@shared/ui';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'calculator',
        pathMatch: 'full',
      },
      {
        path: 'calculator',
        loadChildren: () =>
          import('@finance/calculator').then((m) => m.CALCULATOR_ROUTES),
      },
    ],
  },
];
