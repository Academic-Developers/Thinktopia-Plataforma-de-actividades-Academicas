import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAlumnoHeader } from './dashboard-alumno-header';

describe('DashboardAlumnoHeader', () => {
  let component: DashboardAlumnoHeader;
  let fixture: ComponentFixture<DashboardAlumnoHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAlumnoHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAlumnoHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
