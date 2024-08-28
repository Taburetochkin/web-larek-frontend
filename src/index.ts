import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

import {EventEmitter} from "./components/base/events";
import { LarekAPI } from './components/WebLarekApi';
import { AppState } from './components/AppData';
import { CatalogChangeEvent } from './components/AppData';
import { Card, ICard } from './components/Card';
import { Page } from './components/Page';
import { IProduct } from './types';
import { Modal } from './components/common/Modal';
import { Basket } from './components/modals/Basket';
import { AddressForm } from './components/modals/Address';
import { IAddressForm } from './types';
import { ContactsForm } from './components/modals/Contacts';
import { IContactsForm } from './types';
import { Success } from './components/modals/Success';


const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

const appData = new AppState({}, events);
const page = new Page(document.body, events);
const modal =  new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const addressTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts')
const successTemplate = ensureElement<HTMLTemplateElement>('#success');;

const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderAddress = new AddressForm(cloneTemplate(addressTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);



events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
})

events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});

		return card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

events.on('card:select', (item: ICard) => {
	appData.setPreview(item);
});

events.on('preview:changed', (item: IProduct) => {
	if (item) {
		const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				if (appData.checkOrderedProduct(item)) {
					events.emit('product:delete', item);
				} else {
					events.emit('product:add', item);
				}
			},
		});
		modal.render({
			content: card.render({
				title: item.title,
				description: item.description,
				image: item.image,
				category: item.category,
				price: item.price,
				button: appData.checkOrderedProduct(item) ? 'Удалить из корзины' : 'Купить',
			}),
		});
	} else {
		modal.close();
	}
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on('product:delete', (item: ICard) => {
	appData.deleteFromBasket(item.id);
	modal.close();
}); 

events.on('product:add', (item: ICard) => {
	appData.addToBasket(item);
	modal.close()
});

events.on('number:changed', () => {
	page.counter = appData.basket.length;
});

events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

events.on('basket:changed', () => {

	basket.items = appData.getBasket().map((item, index) => {
		const card = new Card('card', cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				appData.deleteFromBasket(item.id)
			},
		});
		const cardElement = card.render({
			title: item.title, 
			price: item.price,
		})

		const numberElement = cardElement.querySelector('.basket__item-index');
		numberElement.textContent = (index + 1).toString();
		
		return cardElement;
	});

	events.on('address:open', () => {
		modal.render({
			content: orderAddress.render({
				payment: '',
				address: '',
				valid: false,
				errors: [],
			})
		})
	})

	basket.total = appData.getSum();
	appData.order.total = appData.getSum();
});

events.on(/^order\..*:change/, (data: {field: keyof IAddressForm; value: string}) => {
	appData.setAddressForm(data.field, data.value);
	appData.validateAddressForm();
})

events.on('addressErrors:changed', (errors: Partial<IAddressForm>) => {
	const { payment, address } = errors;
	orderAddress.valid = !payment && !address;
	orderAddress.errors = Object.values({ payment, address})
		.filter((i) => !!i)
		.join('; ');
})

events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			valid: false,
			errors: [],
			email: '', 
			phone: '',
		})
	})
})

events.on(/^contacts\..*:change/, (data: {field: keyof IContactsForm; value: string}) => {
	appData.setContactsForm(data.field, data.value);
	appData.validateContactsForm();
})

events.on('contactsErrors:changed', (errors: Partial<IContactsForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone})
		.filter((i) => !!i)
		.join('; ');
})

events.on('contacts:submit', () => {
	// console.log(appData.order);
	appData.order.items = [];
	appData.basket.forEach((item) => {
		if (item.price !== null) {
			appData.order.items.push(item.id);
		}
	})
	api
			.orderProducts(appData.order)
			.then((res) => {
				const success = new Success(cloneTemplate(successTemplate), 
				appData.order.total, 
				{onClick: () => {
					modal.close();
				}});
				success.total = res.total;
				modal.render({content: success.render({})});
				page.counter = 0;
				appData.clearOrder();
				appData.clearBasket();
			})
			.catch((err) => {
				console.error(err);
			});
})

api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });