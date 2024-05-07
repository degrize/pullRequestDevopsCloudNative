import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AssociationsDetailModalGererMembersComponent} from './associations-detail-modal-gerer-members.component';

describe('AssociationsDetailModalGererMembersComponent', () => {
  let component: AssociationsDetailModalGererMembersComponent;
  let fixture: ComponentFixture<AssociationsDetailModalGererMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationsDetailModalGererMembersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociationsDetailModalGererMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
