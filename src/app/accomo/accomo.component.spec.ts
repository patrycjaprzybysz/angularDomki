import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccomoComponent } from './accomo.component';

describe('AccomoComponent', () => {
  let component: AccomoComponent;
  let fixture: ComponentFixture<AccomoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccomoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccomoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
