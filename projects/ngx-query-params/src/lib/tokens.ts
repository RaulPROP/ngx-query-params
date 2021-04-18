import { InjectionToken } from '@angular/core';
import { NgxQueryParamsOptionsOverride } from './types';

export const NGX_QUERY_PARAMS_OPTIONS = 'NGX_QUERY_PARAMS_OPTIONS';
export const NGX_QUERY_PARAMS_OPTIONS_TOKEN = new InjectionToken<NgxQueryParamsOptionsOverride>(
  NGX_QUERY_PARAMS_OPTIONS
);
