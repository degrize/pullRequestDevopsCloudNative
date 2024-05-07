import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AssociationsUpdateComponent} from './associations-update.component';

describe('AssociationsUpdateComponent', () => {
  let component: AssociationsUpdateComponent;
  let fixture: ComponentFixture<AssociationsUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationsUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociationsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
