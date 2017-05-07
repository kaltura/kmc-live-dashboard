import { TestBed, inject } from '@angular/core/testing';

import { KalturaApiService } from './kaltura-api.service';

describe('KalturaApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KalturaApiService]
    });
  });

  it('should ...', inject([KalturaApiService], (service: KalturaApiService) => {
    expect(service).toBeTruthy();
  }));
});
