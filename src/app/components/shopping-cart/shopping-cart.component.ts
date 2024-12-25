import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import { ShoppingCartItem } from '../../models/shopping-cart-item.model';
import { ScCanDeactivate } from '../../services/sc-can-deactivate.service';
import { ProductListComponent } from '../products/product-list/product-list.component';
import { ShoppingCartItemComponent } from './shopping-cart-item/shopping-cart-item.component';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { LoggedInDataService } from '../../services/logged-in-data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
  standalone: true,
  imports: [
    ProductListComponent,
    ShoppingCartItemComponent,
    FormsModule,
    CommonModule,
  ],
})
export class ShoppingCartComponent implements OnInit, ScCanDeactivate {
  cartItems: ShoppingCartItem[] = [];
  isClearCartdisabled = false;
  alert = ' ';
  alertClass = '';

  constructor(
    private sCService: ShoppingCartService,
    private lIDService: LoggedInDataService
  ) {}

  ngOnInit() {
    this.refreshCart();
    this.sCService.refreshCart.subscribe(() => {
      this.refreshCart();
    });
    this.lIDService.currentScreenName.next('Shopping Cart');
  }

  onEnteredNewPrice() {
    this.refreshCart();
  }

  calculateTotal() {
    return this.sCService.calculateTotal();
  }

  onClearCart() {
    this.sCService.clearCart();
    this.refreshCart();
  }

  checkClearCartDisabled() {
    this.isClearCartdisabled = this.isShoppingCartEmpty();
  }

  isShoppingCartEmpty() {
    return this.sCService.getItems().length > 0 ? false : true;
  }

  refreshCart() {
    this.cartItems = this.sCService.getItems();
    this.checkClearCartDisabled();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isShoppingCartEmpty()) {
      return true;
    }

    if (confirm('Do you want to discard the changes to the Shopping Cart?')) {
      this.sCService.clearCart();
      return true;
    }
    return false;
  }
}
