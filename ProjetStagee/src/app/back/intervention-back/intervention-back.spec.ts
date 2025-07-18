import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionBack } from './intervention-back';

describe('InterventionBack', () => {
  let component: InterventionBack;
  let fixture: ComponentFixture<InterventionBack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterventionBack]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterventionBack);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
