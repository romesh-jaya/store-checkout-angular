import { Component } from '@angular/core';
import { ProductListComponent } from '../product-list/product-list.component';
import { ManageProductDetailComponent } from './manage-product-detail/manage-product-detail.component';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-products.component.html',
  standalone: true,
  imports: [ManageProductDetailComponent, ProductListComponent],
  styleUrls: ['./manage-products.component.css'],
})
export class ManageProductsComponent {}
