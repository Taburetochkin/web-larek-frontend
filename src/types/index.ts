export type TPaymentType = 'card' | 'cash'

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export interface IOrder {
  paymentMethod: string;
  email: string;
  phone: string;
	address: string;
	items: string[];
	total: number;
}

export interface IOrderResult {
	id: string;
	total: number;
}

export interface IOrderAddress {
	paymentMethod: string;
	address: string;
}

export interface IOrderContacts {
	email: string;
	phone: string;
}

export interface IBasketCard {
	title: string;
	price: number;
}

export interface IAppStateModel {
	productsList: IProduct[];
	basket: string[];
	order: IOrder | null;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}