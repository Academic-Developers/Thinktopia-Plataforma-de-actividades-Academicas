import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthModels } from './auth-models';

describe('AuthModels', () => {
  let component: AuthModels;
  let fixture: ComponentFixture<AuthModels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthModels]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthModels);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
