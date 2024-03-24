import './create-form.scss';
import { BaseComponent } from '../base-component';
import { Input } from '../input/input';

export class CreateForm extends BaseComponent {
  private readonly color: Input;

  private readonly carName: Input;

  private readonly submit: Input;

  constructor(private onSubmit?: (name: string, color: string) => void) {
    super({ tagName: 'form', className: 'create-form' });
    this.setAttribute('action', '');
    this.carName = new Input({
      type: 'text',
      classNameInput: 'form-input-name',
      name: 'Name',
      placeholder: 'Car name',
    });
    this.color = new Input({ type: 'color', classNameInput: 'form-input-color', name: 'Color' });
    this.submit = new Input({ type: 'submit', classNameInput: 'form-input-button', value: 'Create' });
    const inputsWrapper = new BaseComponent({ tagName: 'div', className: 'form-input-wrapper' });
    inputsWrapper.appendChildren([this.carName, this.color, this.submit]);
    this.appendChildren([inputsWrapper]);

    this.submit.addListener('click', (e: Event) => {
      e.preventDefault();
      const name = this.carName.getValue();
      const color = this.color.getValue();
      this.onSubmit?.(name, color);
    });
  }
}
