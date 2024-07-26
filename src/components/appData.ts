import { IEvents } from './base/events';
import { Model } from './base/model';
import { IAppStateModel, IProduct, IOrder, IOrderContacts, FormErrors } from '../types';

export class Product extends Model<IProduct> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export class AppStateModel extends Model<IAppStateModel> {
  basket: IProduct[] = []; 
	catalog: IProduct[] = []; 
	order: IOrder = {
		paymentMethod: '',
		email: '',
		phone: '',
		address: '',
		items: [],
		total: 0,
	};
  preview: string | null; 
	formErrors: FormErrors = {}; 

  constructor(data: Partial<IAppStateModel>, protected events: IEvents) {
    super(data, events);
  }

  addProduct(product: IProduct): void {
		this.basket.push(product);
		this.emitChanges('basket:change');
	}

  deleteProduct(id: string): void {
		this.basket = this.basket.filter((product) => product.id !== id);
		this.emitChanges('basket:change');
	}

  resetOrder(): void {
		this.order = {
			paymentMethod: '',
			email: '',
			phone: '',
			address: '',
			items: [],
			total: 0,
		};
	}

  resetBasket(): void {
		this.basket.length = 0;
		this.resetOrder();
		this.emitChanges('basket:change');
	}

  getTotalOrder(): number {
		return this.basket.reduce((acc, curr) => acc + curr.price, 0);
	}

  setCatalog(products: IProduct[]): void {
		this.catalog = products.map((product) => new Product(product, this.events));
		this.emitChanges('catalog:change', { catalog: this.catalog });
	}

  getOrderedProducts(): IProduct[] {
		return this.basket;
	}

  productOrdered(product: IProduct): boolean {
		return this.basket.includes(product);
	}

  setOrder(): void {
		this.order.total = this.getTotalOrder();
		this.order.items = this.getOrderedProducts().map((product) => product.id);
	}

  validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.paymentMethod) {
			errors.paymentMethod = 'Необходимо указать способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.formErrors = errors;
		this.events.emit('formAddressErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
	}

  setPaymentMethod(method: string): void {
		this.order.paymentMethod = method;
		this.validateOrder();
	}

  validateContacts() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formContactsErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
	}

  setContactsField(field: keyof Partial<IOrderContacts>, value: string): void {
		this.order[field] = value;
		this.validateContacts();
	}

  setAddress(value: string): void {
		this.order.address = value;
		this.validateOrder();
	}
}

export type CatalogChangeEvent = {
	catalog: Product[];
};