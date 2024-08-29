import { Component } from "./base/component";
import { ensureElement } from "../utils/utils";
import { cardCategoryList } from "../utils/constants";
import { IProduct} from "../types";

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface ICard extends IProduct{
  number?: number;
  button?: string; 
}

export class Card extends Component<ICard> {
  protected _title: HTMLElement;
  protected _description?: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _number?: HTMLElement;
  protected _button?: HTMLButtonElement;

  constructor(blockName: string, container: HTMLElement, actions: ICardActions) {
    super(container);
    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._description = container.querySelector(`.${blockName}__text`);
    this._image = container.querySelector(`.${blockName}__image`);
    this._category = container.querySelector(`.${blockName}__category`);
    this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
    this._number = container.querySelector(`.${blockName}__item-index`);
    this._button = container.querySelector(`.${blockName}__button`);

    if (actions?.onClick) {
      if (this._button) {
          this._button.addEventListener('click', actions.onClick);
      } else {
          container.addEventListener('click', actions.onClick);
      }
    }
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  get id(): string {
		return this.container.dataset.id;
	}

  set title(value: string) {
    this.setText(this._title, value);
  }

  get title(): string {
      return this._title.textContent;
  }

  set description(value: string | string[]) {
    if (Array.isArray(value)) {
        this._description.replaceWith(...value.map(str => {
            const descriptionTemplate = this._description.cloneNode() as HTMLElement;
            this.setText(descriptionTemplate, str);
            return descriptionTemplate;
        }));
    } else {
        this.setText(this._description, value);
    }
  }

  set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

  set category(value: string) {
		this.setText(this._category, value);
    // используется, чтобы убрать класс, из-за которого блок с категорией окрашивается 
    // окрашиваются в неподходящий цвет
    this._category.classList.remove('card__category_other')
    this._category.classList.add(cardCategoryList[value]);
	}

  get category() {
		return this._category.textContent;
	}

  set price(value: number) {
		if (value) {
			this.setText(this._price, `${value} синапсов`);
		} else {
			this.setText(this._price, 'Бесценно');
			this.setDisabled(this._button, true);
		}
	}

  get price(): number {
		return Number(this._price.textContent);
	}

  set number(value: string) {
		this._number.textContent = value;
	}

	get number(): string {
		return this._number.textContent;
	}

  set button(value: string) {
		this.setText(this._button, value);
	}
}

