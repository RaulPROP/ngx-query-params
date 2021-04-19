export interface NgxQueryParamsOptions {
	/**
	 * Whether to log or not the actions.
	 *
	 * Default: `false`
	 */
	log: boolean;
}

export type NgxQueryParamsOptionsOverride = Partial<NgxQueryParamsOptions>;

export type ParamMapGeneric<T> = { [key: string]: T };
export type RawParamsMap = ParamMapGeneric<string>;
export type ParamValidator<T> = (
	rawValue: unknown | null
) => rawValue is ParamValue<T>;
export type ParamValue<T> = T | null;
