import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialEstudioAlumno } from './material-estudio-alumno';

describe('MaterialEstudioAlumno', () => {
  let component: MaterialEstudioAlumno;
  let fixture: ComponentFixture<MaterialEstudioAlumno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialEstudioAlumno]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialEstudioAlumno);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
