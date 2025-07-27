import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionUrgenteComponent } from './intervention-urgente.component';

describe('InterventionUrgenteComponent', () => {
  let component: InterventionUrgenteComponent;
  let fixture: ComponentFixture<InterventionUrgenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterventionUrgenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterventionUrgenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
