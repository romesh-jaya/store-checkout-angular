import { Component, Input } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { PriceEditService } from '../../../services/price-edit.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Product } from '../../../models/product.model';
import { InputDialog } from '../input-dialog/input-dialog';
import { NotificationService } from '../../../services/notification.service';
import { ShoppingCartService } from '../../../services/shopping-cart.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  standalone: true,
  imports: [],
  styleUrls: ['./product.component.css'],
})
export class ProductComponent {
  @Input() productEl?: Product;
  @Input() index = 0;
  inputDialogRef?: MatDialogRef<InputDialog>;

  constructor(
    public dialog: MatDialog,
    private sCService: ShoppingCartService,
    private router: Router,
    private priceEditService: PriceEditService,
    private notificationService: NotificationService,
    private productService: ProductService
  ) {}

  onItemClicked() {
    if (this.router.url.includes('shopping-cart')) {
      this.inputDialogRef = this.dialog.open(InputDialog, {
        disableClose: false,
        width: '500px',
        data: { price: this.productEl?.unitPrice },
      });

      this.inputDialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const discountCalc = result.discount == null ? 0 : +result.discount;

          if (this.productEl?.name) {
            this.sCService.addItem(
              this.productEl.name,
              result.selectedPrice * (1 - discountCalc / 100),
              +result.qty
            );
          }
        }
        this.inputDialogRef = undefined;
      });
    } else if (this.router.url.includes('price-edit')) {
      if (this.productEl?.name) {
        this.priceEditService.editPrice.next(this.productEl.name);
      }
    } else if (this.router.url.includes('manage-products')) {
      if (this.productEl?.name) {
        this.productService.editProduct.next(this.productEl.name);
      }
    }
  }
}
