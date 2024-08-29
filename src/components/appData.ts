import { Model } from "./base/model";
import { IProduct, IAddressForm, IContactsForm, IOrder, FormErrors } from "../types";
import { ICard } from "./card";

export type CatalogChangeEvent = {
  catalog: ICard[];
}

export interface IAppState {
  catalog: IProduct;
  order: IOrder | null;
  errors: FormErrors;
}

export class AppState extends Model<IAppState> {
  basket: ICard[] = [];
  catalog: ICard[];
  preview: string | null;
  order: IOrder = {
    payment: '',
    address: '',
    email: '',
    phone: '',
  };
  errors: FormErrors = {};

  setCatalog(items: ICard[]) {
    this.catalog = items;
    this.emitChanges('items:changed');
  }

  getOrderedProducts(): IProduct[] {
		return this.basket;
	}

  checkOrderedProduct(item: ICard): boolean {
    return this.basket.includes(item);
  }

  setPreview(item: ICard) {
    this.preview = item.id;
    this.emitChanges('preview:changed', item);
  }

  addToBasket(item: ICard) {
    this.basket.push(item);
    this.emitChanges('basket:changed');
    this.emitChanges('number:changed');
  }

  deleteFromBasket(id: string) {
    this.basket = this.basket.filter((item) => item.id !== id);
    this.emitChanges('basket:changed');
    this.emitChanges('number:changed');
  }
  getBasket (): ICard[] {
    return this.basket;
  }

  getBasketItems() {
    return this.basket.map((item) => item.id);
  }

  getSum(): number {
    return this.basket.reduce((total, curr) => {
      return total + curr.price;
    }, 0);
  }

  validateAddressForm() {
    const errors: typeof this.errors = {};
    if (!this.order.payment) {
      errors.payment = 'Отсутствует способ оплаты';
    }
    if (!this.order.address) {
      errors.address = 'Отсутствует адрес доставки';
    }
    this.errors = errors;
    this.events.emit('addressErrors:changed', this.errors);
    return Object.keys(errors).length === 0;
  }

  validateContactsForm() {
    const errors: typeof this.errors = {};
    if (!this.order.email) {
      errors.email = 'Отсутствует почта';
    }
    if (!this.order.phone) {
      errors.phone = 'Отсутствует номер телефона';
    }
    this.errors = errors;
    this.events.emit('contactsErrors:changed', this.errors);
    return Object.keys(errors).length === 0;
  }

  setAddressForm(field: keyof IAddressForm, value: string) {
    this.order[field] = value;
  } 

  setContactsForm(field: keyof IContactsForm, value: string) {
    this.order[field] = value;
  }
  
  clearBasket(){
    this.basket = [];
    this.emitChanges('basket:changed', {basket: []});
  }

  clearOrder() {
    this.order = {
      payment: '',
      address: '',
      email: '',
      phone: '',
    };
  }
}