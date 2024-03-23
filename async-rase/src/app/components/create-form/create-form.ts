import './create-form.scss';
import { BaseComponent } from '../base-component';

export class CreateForm extends BaseComponent {
  constructor(private readonly onSubmit?: () => void) {
    super({ tagName: 'form', className: 'create-form' });
    this.setAttribute('action', '');
  }
}
