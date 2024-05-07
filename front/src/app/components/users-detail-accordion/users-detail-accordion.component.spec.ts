import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UsersDetailAccordionComponent} from './users-detail-accordion.component';

describe('UsersDetailAccordionComponent', () => {
  let component: UsersDetailAccordionComponent;
  let fixture: ComponentFixture<UsersDetailAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersDetailAccordionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersDetailAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
