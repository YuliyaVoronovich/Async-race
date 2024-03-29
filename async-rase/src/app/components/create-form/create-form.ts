import './create-form.scss';
import type { ICar } from 'src/app/interfaces/car';
import { CarService } from '../../sevices/car-service';
import { BaseComponent } from '../base-component';
import { Input } from '../input/input';
import { Button } from '../button/button';

export class CreateForm extends BaseComponent {
  private readonly color: Input;

  private readonly carName: Input;

  private readonly submit = new Input({ type: 'submit', classNameInput: 'form-input-button', value: 'Create' });

  private readonly colorUpdate = new Input({
    type: 'color',
    classNameInput: 'form-input-color',
  });

  private readonly carNameUpdate = new Input({
    type: 'text',
    classNameInput: 'form-input-name',
    name: 'Name',
  });

  private readonly update = new Button({ className: 'form-input-button', textContent: 'Update' });

  private readonly randomGenerate = new Button({
    className: 'form-input-button random-button',
    textContent: 'Generate random car',
  });

  private idCar = 0;

  constructor(
    private onSubmit?: (name: string, color: string) => void,
    private onUpdate?: (id: number, name: string, color: string) => void,
    private onRandome?: () => void,
  ) {
    super({ tagName: 'form', className: 'create-form' });
    this.setAttribute('action', '');
    this.carName = new Input({
      type: 'text',
      classNameInput: 'form-input-name',
      name: 'Name',
      placeholder: "Input car's name",
      value: CarService.saveValues.values.name,
      onInput: this.inputValueName,
    });
    this.color = new Input({
      type: 'color',
      classNameInput: 'form-input-color',
      value: CarService.saveValues.values.color,
      onInput: this.inputValueColor,
    });
    this.resetForm();
    const inputsWrapper = new BaseComponent({ tagName: 'div', className: 'form-input-wrapper' });
    const inputsWrapperUpdate = new BaseComponent({ tagName: 'div', className: 'form-input-wrapper' });
    inputsWrapper.appendChildren([this.carName, this.color, this.submit]);
    inputsWrapperUpdate.appendChildren([this.carNameUpdate, this.colorUpdate, this.update]);
    this.appendChildren([inputsWrapper, inputsWrapperUpdate, this.randomGenerate]);
    this.submitForm();
    this.updateForm();

    this.randomGenerate.addListener('click', (e: Event) => {
      e.preventDefault();
      this.onRandome?.();
    });
  }

  private submitForm = () => {
    this.submit.addListener('click', (e: Event) => {
      e.preventDefault();
      const name = this.carName.getValue();
      const color = this.color.getValue();
      this.onSubmit?.(name, color);
      this.carName.setValue('');
      this.color.setValue('');
    });
  };

  private updateForm = () => {
    this.update.addListener('click', (e: Event) => {
      e.preventDefault();
      const name = this.carNameUpdate.getValue();
      const color = this.colorUpdate.getValue();
      this.onUpdate?.(this.idCar, name, color);
      this.resetForm();
    });
  };

  public fullDataOfCar(car: ICar) {
    this.carNameUpdate.setValue(car.name);
    this.carNameUpdate.removeAttribute('disabled');
    this.colorUpdate.setValue(car.color);
    this.idCar = car.id;
  }

  private resetForm() {
    this.carNameUpdate.setAttribute('disabled', 'disabled');
    this.carNameUpdate.setValue('');
    this.colorUpdate.setValue('');
  }

  private inputValueName = (name: string) => {
    CarService.saveValues.values.name = name;
  };

  private inputValueColor = (color: string) => {
    CarService.saveValues.values.color = color;
  };
}
