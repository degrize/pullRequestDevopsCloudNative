import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ModalMoreDetailsComponent} from './modal-more-details.component';

describe('ModalMoreDetailsComponent', () => {
  let component: ModalMoreDetailsComponent;
  let fixture: ComponentFixture<ModalMoreDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalMoreDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalMoreDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
