import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfBoletaComponent } from './pdf-boleta.component';

describe('PdfBoletaComponent', () => {
  let component: PdfBoletaComponent;
  let fixture: ComponentFixture<PdfBoletaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfBoletaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfBoletaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
