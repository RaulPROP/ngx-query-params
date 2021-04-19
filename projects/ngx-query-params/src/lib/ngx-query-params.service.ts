import { Inject, Injectable, Optional } from '@angular/core';
import {
	ActivatedRoute,
	ParamMap,
	QueryParamsHandling,
	Router,
} from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { NGX_QUERY_PARAMS_OPTIONS_TOKEN } from './tokens';
import {
	NgxQueryParamsOptions,
	NgxQueryParamsOptionsOverride,
	ParamMapGeneric,
	ParamValidator,
	ParamValue,
	RawParamsMap,
} from './types';
import { defaultQueryParamsOptions } from './utils';

@Injectable({
	providedIn: 'root',
})
export class NgxQueryParamsService {
	protected paramsMap: RawParamsMap = {};
	protected paramsSubMap: ParamMapGeneric<BehaviorSubject<string>[]> = {};

	private options: NgxQueryParamsOptions;

	private initialized = false;
	private _destroyed$ = new Subject<void>();

	constructor(
		@Optional()
		@Inject(NGX_QUERY_PARAMS_OPTIONS_TOKEN)
		options: NgxQueryParamsOptionsOverride,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) {
		this.options = { ...defaultQueryParamsOptions, ...(options || {}) };
	}

	ngOnDestroy(): void {
		this._destroyed$.next();
		this._destroyed$.complete();
		this._destroyed$.unsubscribe();
	}

	public async setParameters(
		queryParams: { [key: string]: unknown },
		queryParamsHandling: QueryParamsHandling = 'merge'
	): Promise<boolean> {
		const navigated = await this.router.navigate([], {
			relativeTo: this.activatedRoute,
			queryParams,
			queryParamsHandling,
		});

		this.log(`> setParameters (${navigated ? '✓' : '✗'})\n`, queryParams);

		return navigated;
	}

	public async removeParameters(
		parametersToRemove: string[]
	): Promise<boolean> {
		const queryParams = parametersToRemove.reduce(
			(acc, cur) => ({ ...acc, [cur]: null }),
			{}
		);

		const navigated = await this.router.navigate([], {
			relativeTo: this.activatedRoute,
			queryParams,
			queryParamsHandling: 'merge',
		});

		this.log(
			`> removeParameters (${navigated ? '✓' : '✗'})\n`,
			...parametersToRemove
		);

		return navigated;
	}

	public getParam<T>(
		key: string,
		validator: ParamValidator<T>
	): Observable<ParamValue<T>> {
		const initialValue = this.paramsMap.hasOwnProperty(key)
			? this.paramsMap[key]
			: 'null';

		const sub = new BehaviorSubject<string>(initialValue);

		this.paramsSubMap[key] = [...(this.paramsSubMap[key] || []), sub];

		const obs = sub.asObservable().pipe(
			takeUntil(this._destroyed$),
			map((rawValue) => {
				try {
					return JSON.parse(rawValue);
				} catch (e) {
					return rawValue;
				}
			}),
			map((parsedValue: unknown) => {
				return validator(parsedValue) ? parsedValue : null;
			})
		);

		this.log(`> getParam ${key}`, initialValue, '\n');

		return obs;
	}

	public initialize(): void {
		if (!this.initialized) {
			this.initialized = true;
			this.onStart();
			this.log('> initialize');
		}
	}

	protected onStart(): void {
		this.activatedRoute.queryParamMap
			.pipe(
				takeUntil(this._destroyed$),
				map((params) => this.parseParams(params))
			)
			.subscribe((params: RawParamsMap) => {
				this.log('> QueryParams changed');
				this.paramsMap = params;
				this.emit();
			});
	}

	protected emit(): void {
		const keys = Object.keys(this.paramsMap);
		for (const key of keys) {
			const value = this.paramsMap[key];
			const subs = this.paramsSubMap[key] || [];

			let parsedValue = value;
			try {
				parsedValue = JSON.parse(value);
			} catch (e) {}
			this.log(`> Emitting`, { [key]: parsedValue });
			for (const sub of subs) {
				sub.next(value);
			}
		}
	}

	private parseParams(params: ParamMap): RawParamsMap {
		const ret: RawParamsMap = {};

		for (const key of params.keys) {
			const rawValue = params.getAll(key);
			const value = rawValue.length <= 1 ? params.get(key) : rawValue;
			const parsed = JSON.stringify(value);
			ret[key] = parsed;
		}

		return ret;
	}

	private log(...messages: unknown[]): void {
		if (this.options.log === true) {
			console.debug('[NgxQueryParamsService]\n', ...messages);
		}
	}
}
