import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDocenteHeader } from './dashboard-docente-header';

describe('DashboardDocenteHeader', () => {
  let component: DashboardDocenteHeader;
  let fixture: ComponentFixture<DashboardDocenteHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardDocenteHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardDocenteHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
