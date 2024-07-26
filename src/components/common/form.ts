import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "../base/component";

interface IForm {
  validity: boolean;
  errors: string[];
}

export class Form<T> extends Component<IForm> {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container);
    this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
    this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

    this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

    this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
  }

  protected onInputChange(field: keyof T, value: string) {
    this.events.emit(`${this.container.name}.${String(field)}:change`, { field, value, });
  }

  set validity(value: boolean) {
    this._submit.disabled = !value;
	}

  set errorsList(value: string) {
		this.setText(this._errors, value);
	}

  render(state: Partial<T> & IForm) {
		const { validity, errors, ...inputs } = state;
		super.render({ validity, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}