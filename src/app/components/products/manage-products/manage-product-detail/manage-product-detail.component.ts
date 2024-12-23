import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { ProductService } from '../../../../services/product.service';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../../../../models/product.model';
import { UtilityService } from '../../../../services/utility.service';
import { NotificationService } from '../../../../services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-product-detail',
  templateUrl: './manage-product-detail.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrls: ['./manage-product-detail.component.css'],
})
export class ManageProductDetailComponent implements OnInit {
  @ViewChild('f', { static: false }) aPDForm: NgForm | undefined;
  editMode = false;
  productEdit?: Product;
  productName = '';
  newPrice = '';
  barcode?: number;
  showSpinner = false;

  constructor(
    private productService: ProductService,
    private renderer2: Renderer2,
    public dialog: MatDialog,
    private utilityService: UtilityService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.productService.editProduct.subscribe((productName) => {
      this.aPDForm?.reset();
      this.getProduct(productName);
    });
  }

  getProduct(name: string) {
    this.showSpinner = true;
    this.productService.getProduct(name).subscribe(
      (retProduct) => {
        this.showSpinner = false;
        this.productEdit = retProduct;
        if (this.productEdit) {
          this.productName = retProduct.name;
          this.newPrice = '';
          this.barcode = retProduct.barcode;
          this.editMode = true;
          const firstElement = this.renderer2.selectRootElement('#barcode');
          firstElement.focus();
        }
      },
      (error) => {
        this.showSpinner = false;
        this.notificationService.error(this.utilityService.getError(error));
      }
    );
  }

  customReset() {
    this.productName = '';
    this.newPrice = '';
    this.editMode = false;
    this.aPDForm?.reset();
    const firstElement = this.renderer2.selectRootElement('#name');
    firstElement.focus();
  }

  onAddProduct() {
    this.customReset();
  }

  onDelete() {
    if (this.productEdit?.serverId) {
      if (confirm('Are you sure you wish to delete this product?')) {
        this.productService.removeItem(this.productEdit?.serverId).subscribe(
          () => {
            this.notificationService.success('Product removed.');
            this.customReset();
          },
          (error) => {
            this.showSpinner = false;
            this.notificationService.error(this.utilityService.getError(error));
          }
        );
      }
    }
  }

  onAddEditProduct(form: NgForm) {
    const value = form.value;
    let newBarcode = 0;
    let newProduct;

    if (!this.editMode) {
      // validations
      if (value.newPrice === null || value.newPrice === '') {
        this.notificationService.error(
          'Price is required when a new product is entered'
        );
        return;
      }

      if (value.newPrice < 0) {
        this.notificationService.error(
          'Please enter a non-negative value for price'
        );
        return;
      }

      // Perform actual adding
      if (value.barcode != null) {
        newBarcode = +value.barcode;
      }

      newProduct = new Product(value.name, [+value.newPrice], newBarcode);
      this.showSpinner = true;

      this.productService.addItem(newProduct).subscribe(
        () => {
          this.notificationService.success(
            this.utilityService.getError(
              'Product ' + this.productName + ' added successfully'
            )
          );
          this.showSpinner = false;
          this.customReset();
        },
        (error) => {
          this.showSpinner = false;
          this.notificationService.error(this.utilityService.getError(error));
        }
      );
      this.showSpinner = true;
    } else {
      // Product being  edited
      if (this.productEdit) {
        this.showSpinner = true;
        this.productService
          .editBarcode(this.productEdit, +value.barcode)
          .subscribe(
            () => {
              this.customReset();
              this.showSpinner = false;
              this.notificationService.success(
                this.utilityService.getError(
                  'Product ' + this.productName + ' updated successfully'
                )
              );
            },
            (error) => {
              this.showSpinner = false;
              this.notificationService.error(
                this.utilityService.getError(error)
              );
            }
          );
      }
    }
  }
}
