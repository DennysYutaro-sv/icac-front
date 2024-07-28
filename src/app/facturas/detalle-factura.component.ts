import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { FacturaService } from './services/factura.service';
import { ActivatedRoute } from '@angular/router';
import {MessageService} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html',
  providers: [MessageService]
})
export class DetalleFacturaComponent implements OnInit {

  factura:Factura;

  constructor(
    public facturaService:FacturaService,
    private activatedRoute:ActivatedRoute,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.activatedRoute.paramMap.subscribe(params =>{
      let id = +params.get('id')!;
      this.facturaService.getFactura(id).subscribe(factura =>{
        this.factura = factura;
        this.factura.fechaPago = factura.fechaPago.substring(0,10)+' / '+factura.fechaPago.substring(11,19)
      })
    })
  }

}
