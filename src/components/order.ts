import { IOrderAddress } from '../types';
import { IEvents } from './base/events';
import { Form } from './common/form';

export class OrderAddress extends Form<IOrderAddress> {
  protected _buttons: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this._buttons = Array.from(container.querySelectorAll('.button_alt'));
    this._buttons.forEach((button) => {
			button.addEventListener('click', () => {
				events.emit('paymentMethod:changed', button);
			});
		});
  }

  setButtonClass(name: string): void {
		this._buttons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	}

  set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}
}