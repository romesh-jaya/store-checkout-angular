import { Component, AfterViewInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PriceEditService } from '../../../services/price-edit.service';
import { PriceEditDetailComponent } from './price-edit-detail/price-edit-detail.component';
import { ProductListComponent } from '../product-list/product-list.component';
import { LoggedInDataService } from '../../../services/logged-in-data.service';

@Component({
  selector: 'app-price-edit',
  templateUrl: './price-edit.component.html',
  styleUrls: ['./price-edit.component.css'],
  standalone: true,
  imports: [ProductListComponent, PriceEditDetailComponent],
})
export class PriceEditComponent {
  showSpinner = false;
  productName = '';

  @Input()
  set name(name: string) {
    if (name) {
      this.productName = name;
    }
  }

  constructor(private lIDService: LoggedInDataService) {}

  ngOnInit() {
    this.lIDService.currentScreenName.next('Edit Prices');
  }
}
