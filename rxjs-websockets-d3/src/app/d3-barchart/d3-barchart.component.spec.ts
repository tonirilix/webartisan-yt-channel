import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3BarchartComponent } from './d3-barchart.component';

describe('D3BarchartComponent', () => {
  let component: D3BarchartComponent;
  let fixture: ComponentFixture<D3BarchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3BarchartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3BarchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
