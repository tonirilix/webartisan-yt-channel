import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartRealTimeComponent } from './chart-real-time.component';

describe('ChartRealTimeComponent', () => {
  let component: ChartRealTimeComponent;
  let fixture: ComponentFixture<ChartRealTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartRealTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartRealTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
