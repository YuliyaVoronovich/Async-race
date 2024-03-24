import './create-form.scss';
import type { ICar } from 'src/app/interfaces/car';
import { BaseComponent } from '../base-component';
import { Input } from '../input/input';

export class CreateForm extends BaseComponent {
  private readonly color = new Input({ type: 'color', classNameInput: 'form-input-color' });

  private readonly carName = new Input({
    type: 'text',
    classNameInput: 'form-input-name',
    name: 'Name',
    placeholder: "Input car's name",
  });

  private readonly submit = new Input({ type: 'submit', classNameInput: 'form-input-button', value: 'Create' });

  private readonly colorUpdate = new Input({ type: 'color', classNameInput: 'form-input-color' });

  private readonly carNameUpdate = new Input({
    type: 'text',
    classNameInput: 'form-input-name',
    name: 'Name',
  });

  private readonly update = new Input({ type: 'button', classNameInput: 'form-input-button', value: 'Update' });

  private idCar = 0;

  constructor(
    private onSubmit?: (name: string, color: string) => void,
    private onUpdate?: (id: number, name: string, color: string) => void,
  ) {
    super({ tagName: 'form', className: 'create-form' });
    this.setAttribute('action', '');
    this.resetForm();
    const inputsWrapper = new BaseComponent({ tagName: 'div', className: 'form-input-wrapper' });
    const inputsWrapperUpdate = new BaseComponent({ tagName: 'div', className: 'form-input-wrapper' });
    inputsWrapper.appendChildren([this.carName, this.color, this.submit]);
    inputsWrapperUpdate.appendChildren([this.carNameUpdate, this.colorUpdate, this.update]);
    this.appendChildren([inputsWrapper, inputsWrapperUpdate]);

    this.submit.addListener('click', (e: Event) => {
      e.preventDefault();
      const name = this.carName.getValue();
      const color = this.color.getValue();
      this.onSubmit?.(name, color);
      this.resetForm();
    });

    this.update.addListener('click', (e: Event) => {
      e.preventDefault();
      const name = this.carNameUpdate.getValue();
      const color = this.colorUpdate.getValue();
      this.onUpdate?.(this.idCar, name, color);
      this.resetForm();
    });
  }

  public fullDataOfCar(car: ICar) {
    this.carNameUpdate.setValue(car.name);
    this.carNameUpdate.removeAttribute('disabled');
    this.colorUpdate.setValue(car.color);
    this.idCar = car.id;
  }

  private resetForm() {
    this.carName.setValue('');
    this.color.setValue('');
    this.carNameUpdate.setAttribute('disabled', 'disabled');
    this.carNameUpdate.setValue('');
    this.colorUpdate.setValue('');
  }
}
