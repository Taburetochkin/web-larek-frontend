import { IEvents } from "./base/events";
import { IOrderContacts } from "../types";
import { Form } from "./common/form";

export class OrderContacts extends Form<IOrderContacts> {
  private phoneInput: HTMLInputElement;
	private emailInput: HTMLInputElement;
  
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this.phoneInput =  this.container.elements.namedItem('phone') as HTMLInputElement;
		this.emailInput = this.container.elements.namedItem('email') as HTMLInputElement;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }

  set email(value: string) {
    this.emailInput.value = value;
  }
}