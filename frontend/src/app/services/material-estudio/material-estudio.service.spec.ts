import { TestBed } from '@angular/core/testing';

import { MaterialEstudioService } from './material-estudio.service';

describe('MaterialEstudio', () => {
  let service: MaterialEstudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialEstudioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
