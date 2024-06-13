import { TestBed } from '@angular/core/testing';

import { WebNotificactionService } from './web-notificaction.service';

describe('WebNotificactionService', () => {
  let service: WebNotificactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebNotificactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
