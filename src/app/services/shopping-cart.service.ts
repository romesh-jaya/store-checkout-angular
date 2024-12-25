import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ShoppingCartItem } from '../models/shopping-cart-item.model';

@Injectable({ providedIn: 'root' })
export class ShoppingCartService {
  cartItems: ShoppingCartItem[] = [];
  refreshCart = new Subject<void>();
  cartItemDeleted = new Subject<number>();

  constructor() {
    this.cartItemDeleted.subscribe((index) => {
      this.removeItem(index);
    });
  }

  addItem(name: string, price: number, qty: number) {
    this.cartItems.push(new ShoppingCartItem(name, price, qty));

    this.refreshCart.next();
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
    this.refreshCart.next();
  }

  calculateTotal() {
    let total = 0;
    this.cartItems.forEach((item) => {
      total += Number(item.price) * Number(item.qty);
    });
    return total.toFixed(2);
  }

  clearCart() {
    this.cartItems = [];
  }

  getItems() {
    return this.cartItems.slice();
  }
}
