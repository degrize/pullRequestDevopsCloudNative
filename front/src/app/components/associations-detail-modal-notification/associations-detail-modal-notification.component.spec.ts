import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationsDetailModalNotificationComponent } from './associations-detail-modal-notification.component';

describe('AssociationsDetailModalNotificationComponent', () => {
  let component: AssociationsDetailModalNotificationComponent;
  let fixture: ComponentFixture<AssociationsDetailModalNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationsDetailModalNotificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssociationsDetailModalNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
