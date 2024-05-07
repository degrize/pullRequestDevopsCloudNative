import {TestBed} from '@angular/core/testing';

import {ModalMoreDetailsService} from './modal-more-details.service';

describe('ModalMoreDetailsService', () => {
  let service: ModalMoreDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalMoreDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
