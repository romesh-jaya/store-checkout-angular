import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';
import { Product } from '../../../models/product.model';
import { NotificationService } from '../../../services/notification.service';
import { UtilityService } from '../../../services/utility.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { LoggedInDataService } from '../../../services/logged-in-data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface PriceData {
  lineNo: number;
  product: string;
  price1: number;
  price2: number;
}

@Component({
  selector: 'app-price-overview',
  templateUrl: './price-overview.component.html',
  styleUrls: ['./price-overview.component.scss'],
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, FormsModule],
})
export class PriceOverviewComponent implements OnInit {
  products: Product[] = [];
  showSpinner = false;
  priceData: PriceData[] = [];
  dataSource: any;

  constructor(
    private productService: ProductService,
    private router: Router,
    private utilityService: UtilityService,
    private notificationService: NotificationService,
    private lIDService: LoggedInDataService
  ) {}

  ngOnInit() {
    this.refreshProducts();
    this.lIDService.currentScreenName.next('Price Overview');
  }

  refreshProducts() {
    this.showSpinner = true;
    this.productService.getProductsForQuery(0).subscribe(
      (results) => {
        this.products = results.products;
        this.showSpinner = false;

        let index = 1;
        this.products.forEach((product) => {
          this.priceData.push({
            lineNo: index,
            product: product.name,
            price1: product.unitPrice[0],
            price2: product.unitPrice[1],
          });
          index++;
        });
        this.dataSource = this.priceData;
      },
      (error) => {
        this.showSpinner = false;
        this.notificationService.error(this.utilityService.getError(error));
      }
    );
  }

  onEditClicked(productName: string) {
    this.router.navigate(['/price-edit', productName]);
  }
}
