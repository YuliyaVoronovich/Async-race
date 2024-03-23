import './garage-page.scss';
import { BaseComponent } from '../../components/base-component';
import { CreateForm } from '../../components/create-form/create-form';

export class GaragePage extends BaseComponent {
  private readonly header: BaseComponent;

  private readonly pageNumber: BaseComponent;

  private readonly form: CreateForm;

  constructor() {
    super({ tagName: 'div', className: 'garage-wrapper' });
    this.header = new BaseComponent({ tagName: 'h2', className: 'title', textContent: `Garage` });
    this.pageNumber = new BaseComponent({ tagName: 'h3', className: 'page-number', textContent: `Page #(0)` });
    this.form = new CreateForm();
    this.appendChildren([this.header, this.pageNumber, this.form]);
  }
}
