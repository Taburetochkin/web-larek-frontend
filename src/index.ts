import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';

import { EventEmitter } from './components/base/events';
import { ensureElement, cloneTemplate, createElement } from './utils/utils';

import { Basket } from './components/common/basket';
import { Modal } from './components/common/modal';
import { Success } from './components/common/success';

import { AppStateModel, Product, CatalogChangeEvent } from './components/appData';
import { BasketCard } from './components/basketCard';
import { Card } from './components/card';
import { OrderContacts } from './components/contacts';
import { LarekApi } from './components/larekApi';
import { OrderAddress } from './components/order';
import { Page } from './components/page';
import { IOrderContacts, IOrderAddress, TPaymentType } from './types';

const events = new EventEmitter();

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const api = new LarekApi(CDN_URL, API_URL);
const appData = new AppStateModel({}, events);
const basket = new Basket(cloneTemplate(basketTemplate), events); 
const contacts = new OrderContacts(cloneTemplate(contactsTemplate), events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const page = new Page(document.body, events);
const order = new OrderAddress(cloneTemplate(orderTemplate), events);

api
	.getProductsList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});

events.on<CatalogChangeEvent>('catalog:change', () => {
	page.catalog = appData.catalog.map((product) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('preview:change', product),
		});
		return card.render({
			category: product.category,
			title: product.title,
			image: product.image,
			price: product.price,
		});
	});
	page.counter = appData.getOrderedProducts().length;
});

events.on('preview:change', (item: Product) => {
	if (item) {
		const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				if (appData.productOrdered(item)) {
					events.emit('product:delete', item);
				} else {
					events.emit('product:added', item);
				}
			},
		});
		modal.render({
			content: card.render({
				category: item.category,
				title: item.title,
				description: item.description,
				image: item.image,
				price: item.price,

				button: appData.productOrdered(item) ? 'Удалить из корзины' : 'Купить',
			}),
		});
	} else {
		modal.close();
	}
});
events.on('product:added', (item: Product) => {
	appData.addProduct(item);
	modal.close();
});
events.on('product:delete', (item: Product) => {
	appData.deleteProduct(item.id);
	modal.close();
});
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});
events.on('basket:change', () => {
	page.counter = appData.getOrderedProducts().length;

	basket.items = appData.getOrderedProducts().map((product, index) => {
		const card = new BasketCard(index, cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				appData.deleteProduct(product.id);

				basket.total = appData.getTotalOrder();
			},
		});

		return card.render({ title: product.title, price: product.price });
	});
	events.on('order:open', () => {
		order.setButtonClass('');

		modal.render({
			content: order.render({
        paymentMethod: '',
				address: '',
				validity: false,
				errors: [],
			}),
		});
	});

	events.on('contacts:open', () => {
		modal.render({
			content: contacts.render({
				phone: '',
				email: '',
				validity: false,
				errors: [],
			}),
		});
	});
	events.on('paymentMethod:changed', (data: HTMLButtonElement ) => {
		order.setButtonClass(data.name);
    appData.setPaymentMethod(data.name);
	});
	basket.total = appData.getTotalOrder();
});
events.on('basket:open', () => {
	modal.render({
		content: createElement<HTMLElement>('div', {}, [basket.render()]),
	});
});
events.on('formContactsErrors:change', (errors: Partial<IOrderContacts>) => {
	const { email, phone } = errors;
	contacts.validity = !email && !phone;
	contacts.errorsList = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});
events.on('formAddressErrors:change', (errors: Partial<IOrderAddress>) => {
	const { paymentMethod, address } = errors;
	order.validity = !paymentMethod && !address;
	order.errorsList = Object.values({ paymentMethod, address })
		.filter((i) => !!i)
		.join('; ');
});
events.on(/^order\..*:change/, (data: { value: string }) => {
	appData.setAddress(data.value);
});
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderContacts; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			validity: false,
			errors: [],
		}),
	});
});

events.on('contacts:submit', () => {
	appData.setOrder();
	api
		.sendOrder(appData.order)
		.then((result) => {
			const success = new Success(
				cloneTemplate(successTemplate),
				appData.order.total,
				{
					onClick: () => {
						modal.close();
					},
				}
			);
			modal.render({ content: success.render({}) });
			appData.resetBasket();
			order.setButtonClass('');
			events.emit('basket:change');
		})
		.catch((err) => {
			console.error(err);
		});
});
events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});