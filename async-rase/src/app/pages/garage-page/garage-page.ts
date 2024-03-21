import './garage-page.css';
import { BaseComponent } from '../../components/base-component';

export class GaragePage extends BaseComponent {
  constructor(private section: BaseComponent) {
    super({ tagName: 'div', className: 'garage-wrapper' });
  }
}
