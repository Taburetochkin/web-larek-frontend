import { ensureElement } from "../utils/utils";
import { Component } from "./base/component";
import { ICardActions } from "../types";
import { Card } from "./card";

export class BasketCard extends Component<Card> {
  protected _idx: HTMLElement; 
	protected _title: HTMLElement; 
	protected _button: HTMLButtonElement; 

  constructor(idx: number, container: HTMLElement, events: ICardActions) {
    super(container);
    this._idx = ensureElement<HTMLElement>('.basket__item-index', container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._button = ensureElement<HTMLButtonElement>('.card__button', container);
    this._button.addEventListener('click', events.onClick);
  }

  set title(value: string) {
		this.setText(this._title, value);
	}

  set index(value: number) {
		this.setText(this._idx, value + 1);
	}
}