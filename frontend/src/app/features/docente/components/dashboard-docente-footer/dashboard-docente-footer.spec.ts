import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDocenteFooter } from './dashboard-docente-footer';

describe('DashboardDocenteFooter', () => {
  let component: DashboardDocenteFooter;
  let fixture: ComponentFixture<DashboardDocenteFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardDocenteFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardDocenteFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
