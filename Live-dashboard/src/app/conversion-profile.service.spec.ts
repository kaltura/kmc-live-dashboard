import { TestBed, inject } from '@angular/core/testing';

import { ConversionProfileService } from './conversion-profile.service';

describe('ConversionProfileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConversionProfileService]
    });
  });

  it('should ...', inject([ConversionProfileService], (service: ConversionProfileService) => {
    expect(service).toBeTruthy();
  }));
});
