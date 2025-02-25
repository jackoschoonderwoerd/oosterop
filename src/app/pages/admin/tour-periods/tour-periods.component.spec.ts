import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourPeriodsComponent } from './tour-periods.component';

describe('TourPeriodsComponent', () => {
  let component: TourPeriodsComponent;
  let fixture: ComponentFixture<TourPeriodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourPeriodsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourPeriodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
