import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutModels } from './about-models';

describe('AboutModels', () => {
  let component: AboutModels;
  let fixture: ComponentFixture<AboutModels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutModels]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutModels);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
