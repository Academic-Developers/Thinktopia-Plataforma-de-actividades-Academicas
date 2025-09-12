import { TestBed } from '@angular/core/testing';

import { DashboardDocente } from './materia.service';

describe('DashboardDocente', () => {
  let service: DashboardDocente;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardDocente);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
