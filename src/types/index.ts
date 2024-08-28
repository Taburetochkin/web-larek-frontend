export interface ILarekItem {
	category: string;
	price: number | null;
}

export interface IProductItem {
	id: string;
	title: string;
	description?: string;
	image: string;
}

export type IProduct = IProductItem & ILarekItem;


export interface IAddressForm {
	payment: string;
	address: string;
}

export interface IContactsForm {
	email: string;
	phone: string;
}

export interface IOrder extends IAddressForm, IContactsForm {
	items: string[];
	total: number;
}

export interface IOrderResult {
	id: string;
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;