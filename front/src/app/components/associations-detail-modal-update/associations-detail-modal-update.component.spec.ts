import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AssociationsDetailModalUpdateComponent} from './associations-detail-modal-update.component';

describe('AssociationsDetailModalUpdateComponent', () => {
  let component: AssociationsDetailModalUpdateComponent;
  let fixture: ComponentFixture<AssociationsDetailModalUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationsDetailModalUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociationsDetailModalUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
