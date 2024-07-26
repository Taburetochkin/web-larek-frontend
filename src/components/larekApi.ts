import { IOrder, IProduct, IOrderResult } from "../types";
import { Api, ApiListResponse } from "./base/api";

export interface ILarekApi {
	getProductsList: () => Promise<IProduct[]>;
	getProduct: (id: string) => Promise<IProduct>;
	sendOrder: (order: IOrder) => Promise<IOrderResult>;
}

export class LarekApi extends Api implements ILarekApi {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

  getProductsList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((product) => ({
				...product,
				image: this.cdn + product.image,
			}))
		);
	}

  getProduct(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`).then((product: IProduct) => ({
			...product,
			image: this.cdn + product.image,
		}));
	}

  sendOrder(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}

}