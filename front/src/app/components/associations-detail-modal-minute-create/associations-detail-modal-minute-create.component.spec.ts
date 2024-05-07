import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AssociationsDetailModalMinuteCreateComponent} from './associations-detail-modal-minute-create.component';

describe('AssociationsDetailModalMinuteCreateComponent', () => {
  let component: AssociationsDetailModalMinuteCreateComponent;
  let fixture: ComponentFixture<AssociationsDetailModalMinuteCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationsDetailModalMinuteCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociationsDetailModalMinuteCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
