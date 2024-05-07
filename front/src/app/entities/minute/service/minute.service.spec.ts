import {TestBed} from '@angular/core/testing';

import {MinuteService} from './minute.service';

describe('MinuteService', () => {
  let service: MinuteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MinuteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
