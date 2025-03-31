import { Component, OnInit } from '@angular/core';
import { faSearch, faDownload } from '@fortawesome/free-solid-svg-icons';
import { ProductService } from '../../../services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { Product } from '../../../models/product.model';
import { UtilityService } from '../../../services/utility.service';
import { NotificationService } from '../../../services/notification.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProductComponent } from '../product/product.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatRadioModule,
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    ProductComponent,
    MatCheckboxModule,
  ],
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  searchString = '';
  showSpinner = false;
  searchedAtLeastOnce = false;
  faSearch = faSearch;
  faDownload = faDownload;
  queryUsing = '1';
  pagesize = environment.productsPerPage;
  rowCount = 0;
  lastWasQuery = false;
  pageIndex = 0;
  showInactiveProducts = false;

  constructor(
    private productService: ProductService,
    public dialog: MatDialog,
    private utilityService: UtilityService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {}

  onSearchClicked() {
    this.lastWasQuery = true;
    this.refreshProducts(true);
  }

  onPopulateClicked() {
    this.lastWasQuery = false;
    this.refreshProducts(false);
  }

  onChangedPage(pageData: any) {
    this.refreshProducts(this.lastWasQuery, pageData.pageIndex);
  }

  refreshProducts(isQuery: boolean, pageNo?: number) {
    if (isQuery) {
      if (this.queryUsing === '1') {
        //barcode case
        if (isNaN(+this.searchString)) {
          alert(
            'When querying using barcode, search query must be a number value'
          );
          return;
        }
      } else {
        //name case
        const charsToCheck = ['(', ')'];
        const searchString2 = this.searchString;

        if (
          charsToCheck.some(function (v) {
            return searchString2.indexOf(v) >= 0;
          })
        ) {
          // There's at least one
          alert(
            'Search query cannot contain the following characters: ' +
              charsToCheck.toString()
          );
          return;
        }
      }

      if (this.searchString.length < 3) {
        alert('Search query must contain at least 3 characters');
        return;
      }
    }

    this.showSpinner = true;
    this.pageIndex = pageNo ? pageNo : 0;
    this.productService
      .getProductsForQuery(
        this.pageIndex,
        isQuery ? this.searchString : '',
        isQuery && this.queryUsing === '2' ? true : false,
        this.showInactiveProducts
      )
      .subscribe(
        (results) => {
          this.products = results.products;
          this.rowCount = results.rowCount;
          this.showSpinner = false;
          this.searchedAtLeastOnce = true;
        },
        (error) => {
          this.showSpinner = false;
          this.notificationService.error(this.utilityService.getError(error));
        }
      );
  }
}
