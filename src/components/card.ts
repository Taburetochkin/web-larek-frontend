import { ensureElement } from "../utils/utils";
import { Component } from "./base/component";
import { IProduct, ICardActions } from "../types";
import { cardCategoryList } from "../utils/constants";

interface ICardBase extends IProduct {
	id: string;
	description: string;
	button: string;
}

export type ICard = ICardBase;

export class Card extends Component<ICard> {
  protected _title: HTMLElement;
  protected _image: HTMLImageElement; 
	protected _description: HTMLElement; 
	protected _button: HTMLButtonElement; 
	protected _price: HTMLElement; 
	protected _category: HTMLElement;  

  constructor(blockName: string, container: HTMLElement, events: ICardActions) {
    super(container);
    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
		this._description = container.querySelector(`.${blockName}__text`);
		this._button = container.querySelector(`.${blockName}__button`);
		this._price = ensureElement<HTMLImageElement>(`.${blockName}__price`, container);
		this._category = ensureElement<HTMLImageElement>(`.${blockName}__category`, container);

    if (this._button) {
			this._button.addEventListener('click', events.onClick);
		} else {
			container.addEventListener('click', events.onClick);
		}
  }

  set title(value: string) {
		this.setText(this._title, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

  set button(value: string) {
		this.setText(this._button, value);
	}

  get price(): number {
		return Number(this._price.textContent);
	}

  set price(value: number) {
		if (value) {
			this.setText(this._price, `${value} синапсов`);
		} else {
			this.setText(this._price, 'Бесценно');
			this.setDisabled(this._button, true);
			this.setText(this._button, 'Нельзя купить');
		}
	}

  set category(value: string) {
		this.setText(this._category, value);
		this.toggleClass(this._category, 'card__category' + cardCategoryList[value], true);
	}
}
