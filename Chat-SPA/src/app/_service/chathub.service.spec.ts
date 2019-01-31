/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ChathubService } from './chathub.service';

describe('Service: Chathub', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChathubService]
    });
  });

  it('should ...', inject([ChathubService], (service: ChathubService) => {
    expect(service).toBeTruthy();
  }));
});
