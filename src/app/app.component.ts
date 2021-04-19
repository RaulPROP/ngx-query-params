import {
	ChangeDetectionStrategy,
	Component,
	OnDestroy,
	OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxQueryParamsService } from '@rautils/ngx-query-params';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
	private _destroyed$ = new Subject<void>();

	constructor(private readonly queryParams: NgxQueryParamsService) {}

	async ngOnInit(): Promise<void> {
		this.queryParams
			.getParam<string>(
				'str',
				(val): val is string => typeof val === typeof 'str'
			)
			.pipe(takeUntil(this._destroyed$))
			.subscribe((x) => this.log('str', x));

		this.queryParams
			.getParam<Array<number>>('arr', (val): val is Array<number> =>
				Array.isArray(val)
			)
			.pipe(takeUntil(this._destroyed$))
			.subscribe((x) => this.log('arr', x));

		await this.queryParams.setParameters({
			str: 'hola',
			arr: [0, 1, 2, 3],
		});
	}

	ngOnDestroy(): void {
		this._destroyed$.next();
		this._destroyed$.complete();
		this._destroyed$.unsubscribe();
	}

	private log(name: string, x: unknown): void {
		console.log('[AppComponent]', { name, value: x, type: typeof x });
	}
}
