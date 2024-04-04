import './create-form.scss';
import type { ICar } from 'src/app/interfaces/car';
import { carService } from '../../sevices/car-service';
import { BaseComponent } from '../base-component';
import { Input } from '../input/input';
import { Button } from '../button/button';

export class FormCreate extends BaseComponent<HTMLFormElement> {
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

  private carId = 0;

  constructor(
    private onSubmit?: (name: string, color: string) => void,
    private onUpdate?: (id: number, name: string, color: string) => void,
    private onRandome?: () => void,
  ) {
    super({ tag: 'form', className: 'create-form' });
    this.node.action = '';
    this.carName = new Input({
      type: 'text',
      classNameInput: 'form-input-name',
      name: 'Name',
      placeholder: "Input car's name",
      value: carService.saveValues.values.name,
      onInput: this.inputValueName,
    });
    this.color = new Input({
      type: 'color',
      classNameInput: 'form-input-color',
      value: carService.saveValues.values.color,
      onInput: this.inputValueColor,
    });
    this.resetUpdatesElementsOfForm();
    const inputsWrapper = new BaseComponent({ tag: 'div', className: 'form-input-wrapper' });
    const inputsWrapperUpdate = new BaseComponent({ tag: 'div', className: 'form-input-wrapper' });
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
      this.reset();
    });
  };

  private updateForm = () => {
    this.update.addListener('click', (e: Event) => {
      e.preventDefault();
      const name = this.carNameUpdate.getValue();
      const color = this.colorUpdate.getValue();
      this.onUpdate?.(this.carId, name, color);
      this.resetUpdatesElementsOfForm();
    });
  };

  public fillDataUpdatesOfSelectCar(car: ICar) {
    this.carNameUpdate.setValue(car.name);
    this.carNameUpdate.removeAttribute('disabled');
    this.colorUpdate.setValue(car.color);
    this.carId = car.id;
  }

  private reset() {
    this.carName.setValue('');
    this.color.setValue('');
  }

  private resetUpdatesElementsOfForm() {
    this.carNameUpdate.setAttribute('disabled', 'disabled');
    this.carNameUpdate.setValue('');
    this.colorUpdate.setValue('');
  }

  private inputValueName = (name: string) => {
    carService.saveValues.values.name = name;
  };

  private inputValueColor = (color: string) => {
    carService.saveValues.values.color = color;
  };
}
