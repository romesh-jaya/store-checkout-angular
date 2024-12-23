import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PriceEditService } from '../../../../services/price-edit.service';
import { ProductService } from '../../../../services/product.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Product } from '../../../../models/product.model';
import { NotificationService } from '../../../../services/notification.service';
import { UtilityService } from '../../../../services/utility.service';
import { CommonModule } from '@angular/common';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-price-edit-detail',
  templateUrl: './price-edit-detail.component.html',
  styleUrls: ['./price-edit-detail.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
})
export class PriceEditDetailComponent implements OnInit {
  @ViewChild('f', { static: false }) pEForm?: NgForm;
  product?: Product;
  updatedPrice: { price?: number }[] = [];
  faPlus = faPlus;
  showSpinner = false;
  @Input() productName = '';

  constructor(
    private pEService: PriceEditService,
    private productService: ProductService,
    private utilityService: UtilityService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.pEService.editPrice.subscribe((productName) => {
      this.pEForm?.reset();
      this.getProduct(productName);
    });

    if (this.productName) {
      this.getProduct(this.productName);
    }
  }

  getProduct(name: string) {
    this.showSpinner = true;
    this.productService.getProduct(name).subscribe(
      (retProduct) => {
        this.showSpinner = false;
        this.product = retProduct;
        if (this.product) {
          this.updatedPrice = [];
          this.product.unitPrice.forEach((price) => {
            this.updatedPrice.push({ price });
          });
        }
      },
      (error) => {
        this.showSpinner = false;
        this.notificationService.error(this.utilityService.getError(error));
      }
    );
  }

  validatePrices() {
    let isValid = true;
    this.updatedPrice.forEach((newPrice) => {
      if (isValid && newPrice.price && newPrice.price < 0) {
        isValid = false;
        this.notificationService.error(
          'Please enter a non-negative value for price'
        );
      }
    });
    return isValid;
  }

  onUpdate(form: NgForm) {
    const returnPrices: number[] = [];

    if (!this.validatePrices()) {
      return;
    }

    this.updatedPrice.forEach((newPrice) => {
      // remove duplicated
      if (!returnPrices.find((returnPrice) => returnPrice === newPrice.price)) {
        if (newPrice.price !== undefined) {
          returnPrices.push(+newPrice.price.toFixed(2));
        }
      }
    });

    if (returnPrices.length == 0) {
      this.showSpinner = false;
      this.notificationService.error('Cannot remove all prices of a product');
      return;
    }

    this.showSpinner = true;
    if (this.product) {
      this.productService.updatePrice(this.product, returnPrices).subscribe(
        () => {
          this.notificationService.success('Prices updated successfully');
          this.updatedPrice = [];
          this.product = undefined;
          this.showSpinner = false;
          form.reset();
        },
        (error) => {
          this.showSpinner = false;
          this.notificationService.error(this.utilityService.getError(error));
        }
      );
    }
  }

  onRemovePrice(index: number, form: NgForm) {
    form.controls['rowsDeleted'].markAsDirty();
    this.updatedPrice.splice(index, 1);
  }

  onNewPrice() {
    this.updatedPrice.push({ price: undefined });
  }
}
