import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";

interface ISuccess {
  total: number;
}

interface ISuccessActions {
  onClick: () => void;
}

export class Success extends Component<ISuccess> {
  protected _total: HTMLElement;
  protected _close: HTMLElement;

  constructor(container: HTMLElement, total: number, actions: ISuccessActions) {
    super(container);
    this._total = ensureElement<HTMLElement>('.order-success__description', this.container);
		this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
    this.setText(this._total, `Списано ${total} синапсов`);
    if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
  }
}