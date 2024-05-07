import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AssociationsListModalCreateComponent} from './associations-list-modal-create.component';

describe('AssociationsListModalCreateComponent', () => {
  let component: AssociationsListModalCreateComponent;
  let fixture: ComponentFixture<AssociationsListModalCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationsListModalCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociationsListModalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
