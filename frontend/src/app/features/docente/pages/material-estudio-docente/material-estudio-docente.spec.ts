import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialEstudioDocente } from './material-estudio-docente';

describe('MaterialEstudioDocente', () => {
  let component: MaterialEstudioDocente;
  let fixture: ComponentFixture<MaterialEstudioDocente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialEstudioDocente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialEstudioDocente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
