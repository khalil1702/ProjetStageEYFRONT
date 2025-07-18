import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashborddComponent } from './dashbordd.component';

describe('DashborddComponent', () => {
  let component: DashborddComponent;
  let fixture: ComponentFixture<DashborddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashborddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashborddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
