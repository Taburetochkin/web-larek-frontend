import { EventEmitter } from "../base/events";
import { Component } from "../base/component";
import { createElement, ensureElement } from "../../utils/utils";

export interface IBasket {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasket> {
  protected _list:  HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

    this._button.addEventListener('click', () => {
			events.emit('address:open');
		});
		this.items = [];
  }

  set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
		this.setDisabled(this._button, items.length === 0);
	}

  set total(total: number) {
		this.setText(this._total, `${total} синапсов`);
	}
}