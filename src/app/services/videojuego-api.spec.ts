import { TestBed } from '@angular/core/testing';

import { VideojuegoApi } from './videojuego-api';

describe('VideojuegoApi', () => {
  let service: VideojuegoApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideojuegoApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
