import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Product } from '../models/product.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  baseURL = environment.nodeEndPoint + '/products';
  errorOccured = false;
  editProduct = new Subject<string>();

  constructor(private http: HttpClient) {}

  updatePrice(product: Product, prices: number[]) {
    const patchData = { ...product };
    (patchData as any).unitPrice = prices;
    const uRL = this.baseURL + '/' + product.serverId;
    return this.http.patch(uRL, patchData);
  }

  addItem(product: Product) {
    return this.http.post<Product>(this.baseURL, product);
  }

  editBarcode(product: Product, barcode: number) {
    const patchData = { ...product };
    (patchData as any).barcode = barcode;
    const uRL = this.baseURL + '/' + product.serverId;
    return this.http.patch(uRL, patchData);
  }

  removeItem(serverId: string) {
    const uRL = this.baseURL + '/' + serverId;
    return this.http.delete(uRL);
  }

  getProduct(name: string) {
    const uRL = this.baseURL + '?name=' + name;
    return this.http.get<any>(uRL).pipe(
      map((product) => {
        return new Product(
          (product.product as any).name,
          (product.product as any).unitPrice,
          (product.product as any).barcode,
          (product.product as any)._id
        );
      })
    );
  }

  getProductsForQuery(
    currentPage: number,
    queryString?: string,
    queryForNameFlag?: boolean,
    showInactiveProducts = false
  ) {
    let params = new HttpParams();
    params = params.append('currentPage', currentPage.toString());
    params = params.append('pagesize', environment.productsPerPage.toString());

    if (queryString && queryForNameFlag) {
      params = params.append('queryForName', queryString);
    } else if (queryString) {
      params = params.append('queryForBarcode', queryString);
    }

    params = params.append('showInactiveProducts', showInactiveProducts);

    return this.http.get(this.baseURL, { params: params }).pipe(
      map((productData: any) => {
        if (productData.products.length > 0) {
          return {
            products: productData.products.map((product: Product) => {
              return new Product(
                (product as any).name,
                (product as any).unitPrice,
                (product as any).barcode,
                (product as any)._id
              );
            }),
            rowCount: productData.totalCount,
          };
        } else {
          return { products: [], rowCount: 0 };
        }
      })
    );
  }
}
