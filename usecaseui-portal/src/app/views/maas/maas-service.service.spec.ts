import { TestBed, inject } from '@angular/core/testing';

import { MaasServiceService } from './maas-service.service';

describe('MaasServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MaasServiceService]
    });
  });

  it('should be created', inject([MaasServiceService], (service: MaasServiceService) => {
    expect(service).toBeTruthy();
  }));
});
