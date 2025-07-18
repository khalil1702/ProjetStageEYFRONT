import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBack } from './user-back';

describe('UserBack', () => {
  let component: UserBack;
  let fixture: ComponentFixture<UserBack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBack]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserBack);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
