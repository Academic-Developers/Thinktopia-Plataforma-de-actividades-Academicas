import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionContenido } from './gestion-contenido';

describe('GestionContenido', () => {
  let component: GestionContenido;
  let fixture: ComponentFixture<GestionContenido>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionContenido]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionContenido);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
