import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenidoFormModal } from './contenido-form-modal';

describe('ContenidoFormModal', () => {
  let component: ContenidoFormModal;
  let fixture: ComponentFixture<ContenidoFormModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContenidoFormModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContenidoFormModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
