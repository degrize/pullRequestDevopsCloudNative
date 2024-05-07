import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AssociationsDetailModalLeaveComponent} from './associations-detail-modal-leave.component';

describe('AssociationsDetailModalLeaveComponent', () => {
  let component: AssociationsDetailModalLeaveComponent;
  let fixture: ComponentFixture<AssociationsDetailModalLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationsDetailModalLeaveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociationsDetailModalLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
