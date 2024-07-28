import { TestBed } from '@angular/core/testing';

import { ManUsuarioService } from './man-usuario.service';

describe('ManUsuarioService', () => {
  let service: ManUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManUsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
