import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PriceEditService } from './price-edit.service';
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
export class PriceEditComponent implements AfterViewInit {
  productName = '';
  showSpinner = false;

  constructor(
    private route: ActivatedRoute,
    private pEService: PriceEditService,
    private lIDService: LoggedInDataService
  ) {}

  ngOnInit() {
    this.lIDService.currentScreenName.next('Edit Prices');
  }

  //This is required to be ngAfterViewInit() and not ngOnInit().
  // Otherwise data doesn't display properly in the detail form
  ngAfterViewInit() {
    this.productName = this.route.snapshot.params['name'];
    this.setDataForEdit();
    this.route.params.subscribe((params: Params) => {
      this.productName = params['name'];
      this.setDataForEdit();
    });
  }

  setDataForEdit() {
    if (this.productName) {
      this.pEService.editPrice.next(this.productName);
    }
  }
}
