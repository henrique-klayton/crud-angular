import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from 'src/app/shared/service/base.service';
import { AddressService } from '../../address/service/address.service';
import { ProductFormModel } from '../../product/form/model/product.form.model';
import { ProductService } from '../../product/service/product.service';
import { SaleService } from '../../sales/service/sale.service';
import { TotalsModel } from '../model/totals-model';

@Injectable()
export class DashboardService extends BaseService {
	private _baseRoute = 'Dashboard';

	constructor(
		private _address: AddressService,
		private _product: ProductService,
		private _sale: SaleService
	) {
		super();
	}

	fetchTotals = () => this.get<TotalsModel>(`${this._baseRoute}/Totals`);

	fetchSales = (): Observable<number[]> => this._sale.fetchData().pipe(
		map(sales => {
			let data: number[] = new Array(12).fill(0);
			sales.forEach(sale => {
				const index = moment(sale.created.seconds * 1000).month();
				data[index] = data[index] + sale.products.reduce((total, prod) => total + prod.price, 0);
			});
			return data;
		})
	);
	fetchProducts = (): Observable<ProductFormModel[]> => this._product.fetchData();
}