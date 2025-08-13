import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteLayout } from './docente-layout';

describe('DocenteLayout', () => {
  let component: DocenteLayout;
  let fixture: ComponentFixture<DocenteLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocenteLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocenteLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
