import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipementBack } from './equipement-back';

describe('EquipementBack', () => {
  let component: EquipementBack;
  let fixture: ComponentFixture<EquipementBack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipementBack]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipementBack);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
