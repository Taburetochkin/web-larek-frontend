export abstract class Component<T> {
  protected constructor(protected readonly container: HTMLElement) {}

  toggleClass(element: HTMLElement, className: string, state?: boolean) {
    element.classList.toggle(className, state);
  }

  protected setVisible(element: HTMLElement) {
		element.style.display = 'block';
	}

  protected setHidden(element: HTMLElement) {
		element.style.display = 'none';
	}

  protected setText(element: HTMLElement, text: unknown) {
    if (element) {
      element.textContent = String(text);
    }
  }

  setDisabled(element: HTMLElement, disabled: boolean) {
		if (element) {
			if (disabled) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}

  protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}

  render(data?: Partial<T>): HTMLElement {
    data ??= {};
    Object.assign(this as object, data);
    return this.container;
  }
}