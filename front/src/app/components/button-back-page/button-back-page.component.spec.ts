import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ButtonBackPageComponent} from './button-back-page.component';

describe('ButtonBackPageComponent', () => {
  let component: ButtonBackPageComponent;
  let fixture: ComponentFixture<ButtonBackPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonBackPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonBackPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
