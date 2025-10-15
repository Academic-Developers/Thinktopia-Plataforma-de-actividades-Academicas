import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadesAlumno } from './actividades-alumno';

describe('ActividadesAlumno', () => {
  let component: ActividadesAlumno;
  let fixture: ComponentFixture<ActividadesAlumno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadesAlumno]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActividadesAlumno);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
