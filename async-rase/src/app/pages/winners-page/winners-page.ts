import { BaseComponent } from '../../components/base-component';

export class WinnersPage extends BaseComponent {
  constructor(private section: BaseComponent) {
    super({ tagName: 'div', className: 'winners-wrapper' });
  }
}
