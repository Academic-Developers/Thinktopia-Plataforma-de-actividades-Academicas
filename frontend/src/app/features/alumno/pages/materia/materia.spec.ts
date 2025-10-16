import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriasAlumno } from './materias';

describe('MateriasAlumno', () => {
  let component: MateriasAlumno;
  let fixture: ComponentFixture<MateriasAlumno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MateriasAlumno]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MateriasAlumno);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
