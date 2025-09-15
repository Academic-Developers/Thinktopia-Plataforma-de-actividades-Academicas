import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnoLayout } from './alumno-layout';

describe('AlumnoLayoutComponent', () => {
  let component: AlumnoLayout;
  let fixture: ComponentFixture<AlumnoLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlumnoLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlumnoLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
