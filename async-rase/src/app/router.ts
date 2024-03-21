import type { BaseComponent } from './components/base-component';
import type Page from './pages/page';

export default class Router {
  constructor(private routerOutlet: Page) {
    window.addEventListener('hashchange', this.handleLocation.bind(this));
    this.handleLocation();
  }

  public handleLocation(): void {
    const pathname = window.location.hash.slice(1);
    const currentPath = `/${pathname}`;
    console.log(currentPath);

    this.setViewContent(currentPath)
      .then((data) => {
        console.log(data);
        this.routerOutlet.setContent(data);
      })
      .catch(() => {});
  }

  private setViewContent = async (location: string): Promise<BaseComponent> => {
    switch (location) {
      case '/garage': {
        const { GaragePage } = await import('./pages/garage-page/garage-page');
        return new GaragePage();
      }
      case '/winners': {
        const { WinnersPage } = await import('./pages/winners-page/winners-page');
        return new WinnersPage();
      }
      default: {
        console.log('default');
        const { GaragePage } = await import('./pages/garage-page/garage-page');
        return new GaragePage();
      }
    }
  };
}
