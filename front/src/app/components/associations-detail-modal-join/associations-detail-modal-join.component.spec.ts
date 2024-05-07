import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AssociationsDetailModalJoinComponent} from './associations-detail-modal-join.component';

describe('AssociationsDetailModalJoinComponent', () => {
  let component: AssociationsDetailModalJoinComponent;
  let fixture: ComponentFixture<AssociationsDetailModalJoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationsDetailModalJoinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociationsDetailModalJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
