import { TestBed } from '@angular/core/testing';
import { NgxQueryParamsService } from './ngx-query-params.service';

describe('NgxQueryParamsService', () => {
	let service: NgxQueryParamsService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(NgxQueryParamsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
