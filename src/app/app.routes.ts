import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { AuthGuard } from './guards/auth.guard';
import { ManageProductsComponent } from './components/products/manage-products/manage-products.component';
import { PriceOverviewComponent } from './components/products/price-overview/price-overview.component';
import { PriceEditComponent } from './components/products/price-edit/price-edit.component';
import { AdminGuard } from './guards/admin.guard';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent, pathMatch: 'full' },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'shopping-cart',
    component: ShoppingCartComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'manage-products',
    component: ManageProductsComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'price-overview',
    component: PriceOverviewComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'price-edit',
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: PriceEditComponent,
      },
      {
        path: ':name',
        component: PriceEditComponent,
      },
    ],
  },

  { path: '**', component: PageNotFoundComponent },
];
