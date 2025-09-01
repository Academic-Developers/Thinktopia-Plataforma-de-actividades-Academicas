import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAlumnoFooter } from './dashboard-alumno-footer';

describe('DashboardAlumnoFooter', () => {
  let component: DashboardAlumnoFooter;
  let fixture: ComponentFixture<DashboardAlumnoFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAlumnoFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAlumnoFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
