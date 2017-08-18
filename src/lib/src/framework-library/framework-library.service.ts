import { Inject, Injectable }               from '@angular/core';

import { WidgetLibraryService }             from '../widget-library/widget-library.service';

// No framework - unmodified HTML controls, with styles from layout only
import { NoFrameworkComponent }             from './no-framework.component';

// Bootstrap 3 Framework
// https://github.com/valor-software/ng2-bootstrap
import { Bootstrap3FrameworkComponent }     from './bootstrap-3-framework.component';

// Suggested future frameworks:

// Bootstrap 4:
// https://github.com/ng-bootstrap/ng-bootstrap
// http://v4-alpha.getbootstrap.com/components/forms/

// Foundation 6:
// https://github.com/zurb/foundation-sites

// Semantic UI:
// https://github.com/vladotesanovic/ngSemantic

export type Framework = {
  framework: any,
  widgets?: { [key: string]: any },
  stylesheets?: string[],
  scripts?: string[]
};

export type FrameworkLibrary = { [key: string]: Framework };

@Injectable()
export class FrameworkLibraryService {
  activeFramework: Framework = null;
  stylesheets: (HTMLStyleElement|HTMLLinkElement)[];
  scripts: HTMLScriptElement[];
  loadExternalAssets: boolean = false;
  defaultFramework: string = 'bootstrap-3';
  frameworkLibrary: FrameworkLibrary = {
    'no-framework': { framework: NoFrameworkComponent },
    'bootstrap-3': {
      framework: Bootstrap3FrameworkComponent,
    }
  };

  constructor(
    @Inject(WidgetLibraryService) private widgetLibrary: WidgetLibraryService
  ) { }

  registerFrameworkWidgets(framework: Framework): boolean {
    if (framework.hasOwnProperty('widgets')) {
      this.widgetLibrary.registerFrameworkWidgets(framework.widgets);
      return true;
    }
    this.widgetLibrary.unRegisterFrameworkWidgets();
    return false;
  }

  public setLoadExternalAssets(loadExternalAssets: boolean = true): void {
    this.loadExternalAssets = !!loadExternalAssets;
  }

  public setFramework(
    framework?: string|Framework, loadExternalAssets: boolean = this.loadExternalAssets
  ): boolean {
    if (!framework) return false;
    let validNewFramework: boolean = false;
    if (!framework || framework === 'default') {
      this.activeFramework = this.frameworkLibrary[this.defaultFramework];
      validNewFramework = true;
    } else if (typeof framework === 'string' && this.hasFramework(framework)) {
      this.activeFramework = this.frameworkLibrary[framework];
      validNewFramework = true;
    } else if (typeof framework === 'object' && framework.hasOwnProperty('framework')) {
      this.activeFramework = framework;
      validNewFramework = true;
    }
    if (validNewFramework) {
      this.registerFrameworkWidgets(this.activeFramework);
    }
    return validNewFramework;
  }

  public hasFramework(type: string): boolean {
    if (!type || typeof type !== 'string') return false;
    return this.frameworkLibrary.hasOwnProperty(type);
  }

  public getFramework(): any {
    if (!this.activeFramework) this.setFramework('default', true);
    return this.activeFramework.framework;
  }

  public getFrameworkWidgets(): any {
    return this.activeFramework.widgets || {};
  }

  public getFrameworkStylesheets(load: boolean = this.loadExternalAssets): string[] {
    return load ? this.activeFramework.stylesheets || [] : [];
  }

  public getFrameworkScripts(load: boolean = this.loadExternalAssets): string[] {
    return load ? this.activeFramework.scripts || [] : [];
  }
}
