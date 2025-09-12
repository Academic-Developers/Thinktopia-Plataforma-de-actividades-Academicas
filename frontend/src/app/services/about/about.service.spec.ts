import { TestBed } from '@angular/core/testing';

import { ContentInfo } from './about.service';

describe('ContentInfo', () => {
  let service: ContentInfo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentInfo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
