import { BaseComponent } from '../base-component';

interface IInput {
  type: string;
  classNameInput: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  onInput?: (input: HTMLInputElement) => boolean;
}

export class Input extends BaseComponent {
  protected input: HTMLInputElement;

  constructor({ type, classNameInput, name, placeholder, value, onInput }: IInput) {
    super({
      tagName: 'input',
      className: classNameInput,
    });
    this.input = this.node as HTMLInputElement;

    this.addListener('change', () => onInput);
    this.setAttributes(type, name ?? '', placeholder ?? '', value ?? '');
  }

  private setAttributes(type: string, name: string, placeholder: string, value: number | string): void {
    this.setAttribute('name', name);
    this.setAttribute('type', type);
    if (placeholder) {
      this.setAttribute('placeholder', placeholder);
    }
    if (value) {
      this.setAttribute('value', value.toString());
    }
  }

  public getValue(): string {
    return this.input.value;
  }

  public setValue(value: string): void {
    this.input.value = value;
  }
}
