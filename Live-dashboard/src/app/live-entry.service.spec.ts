import { TestBed, inject } from '@angular/core/testing';

import { LiveEntryService } from './live-entry.service';

describe('LiveEntryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LiveEntryService]
    });
  });

  it('should ...', inject([LiveEntryService], (service: LiveEntryService) => {
    expect(service).toBeTruthy();
  }));
});
