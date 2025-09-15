import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialEstudio } from './material-estudio';

describe('MaterialEstudio', () => {
  let component: MaterialEstudio;
  let fixture: ComponentFixture<MaterialEstudio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialEstudio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialEstudio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
