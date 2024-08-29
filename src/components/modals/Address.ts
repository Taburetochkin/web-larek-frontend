import { Form } from "../common/form";
import { IEvents } from "../base/events";
import { IAddressForm } from "../../types";
import { ensureAllElements } from "../../utils/utils";

export class AddressForm extends Form<IAddressForm> {
  protected _buttons: HTMLButtonElement[];
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this._buttons = ensureAllElements(".button_alt", this.container);

		this._buttons.forEach((button) =>
			button.addEventListener('click', () => {
        this.payment = button.name;
        this.onInputChange(`payment`, button.name);
			})
		);
  }

  set payment(name : string) {
    this._buttons.forEach((button => {
      this.toggleClass(button, 'button_alt-active', button.name === name);
    })) 

  }

  set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}
}