import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckProcessModelComponent } from './check-process-model.component';

describe('CheckProcessModelComponent', () => {
	let component: CheckProcessModelComponent;
	let fixture: ComponentFixture<CheckProcessModelComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CheckProcessModelComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CheckProcessModelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
