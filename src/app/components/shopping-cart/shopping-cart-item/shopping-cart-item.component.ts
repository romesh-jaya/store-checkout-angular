import { Component, Input } from '@angular/core';
import { ShoppingCartItem } from '../../../models/shopping-cart-item.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ShoppingCartService } from '../../../services/shopping-cart.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-shopping-cart-item',
  templateUrl: './shopping-cart-item.component.html',
  styleUrls: ['./shopping-cart-item.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
  ],
})
export class ShoppingCartItemComponent {
  @Input() cartItem?: ShoppingCartItem;
  @Input() index = 0;

  constructor(private sCService: ShoppingCartService) {}

  onRemoveItem() {
    this.sCService.cartItemDeleted.next(this.index);
  }
}
