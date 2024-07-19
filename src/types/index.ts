export type TPaymentType = 
  'онлайн' | 
  'при получении'

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
  paymentMethod: TPaymentType;
  email: string;
  phoneNumber: string;
	address: string;
	basket: IBasket;
}

export interface IOrderResult {
	id: string;
	totalPayment: number;
}

export interface IOrderAddress {
	paymentMethod: TPaymentType;
	address: string;
}

export interface IOrderContacts {
	email: string;
	phone: string;
}

export interface IBasket {
	title: string;
	totalPrice: number;
}

export interface IAppStateModel {
	productsList: IProduct[];
	basket: IBasket;
	order: IOrder | null;
}

export interface IFormActions {
	onClick: (event: MouseEvent) => void;
}