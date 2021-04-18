import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { NgxQueryParamsService } from './ngx-query-params.service';
import { NGX_QUERY_PARAMS_OPTIONS_TOKEN } from './tokens';
import { NgxQueryParamsOptionsOverride } from './types';
import { initializer } from './utils';

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
})
export class NgxQueryParamsModule {
  public static forRoot(
    config?: NgxQueryParamsOptionsOverride
  ): ModuleWithProviders<NgxQueryParamsModule> {
    return {
      ngModule: NgxQueryParamsModule,
      providers: [
        {
          provide: NGX_QUERY_PARAMS_OPTIONS_TOKEN,
          useValue: config || {},
        },
        {
          provide: APP_INITIALIZER,
          useFactory: initializer,
          deps: [NgxQueryParamsService],
          multi: true,
        },
      ],
    };
  }
}
