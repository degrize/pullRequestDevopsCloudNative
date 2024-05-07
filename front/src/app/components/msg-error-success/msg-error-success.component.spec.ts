import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MsgErrorSuccessComponent} from './msg-error-success.component';

describe('MsgErrorSuccessComponent', () => {
  let component: MsgErrorSuccessComponent;
  let fixture: ComponentFixture<MsgErrorSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsgErrorSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsgErrorSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
