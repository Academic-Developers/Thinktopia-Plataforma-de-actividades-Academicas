import { TestBed } from '@angular/core/testing';

import { MaterialEstudio } from './material-estudio';

describe('MaterialEstudio', () => {
  let service: MaterialEstudio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialEstudio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
