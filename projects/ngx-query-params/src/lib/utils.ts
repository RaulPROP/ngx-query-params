import { NgxQueryParamsService } from './ngx-query-params.service';
import { NgxQueryParamsOptions } from './types';

export const defaultQueryParamsOptions: NgxQueryParamsOptions = {
  log: false,
};

export const initializer = (queryParamsService: NgxQueryParamsService) => {
  return async () => {
    await queryParamsService.initialize();
  };
};
