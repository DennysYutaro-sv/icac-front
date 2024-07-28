import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { Colegiado } from '../colegiado';
import { ColegiadoService } from '../colegiado.service';
import { Factura } from '../../facturas/models/factura';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html'
})
export class DetalleComponent implements OnInit {

  public colegiado:Colegiado = new Colegiado();

  public facturas:Factura[] = [];

  constructor(
    private primengConfig: PrimeNGConfig,
    public colegiadoService : ColegiadoService,
    private router:Router,
    public activatedRouter: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cargarColegiado();
    this.primengConfig.ripple = true;
  }

  cargarColegiado():void{
    this.activatedRouter.params.subscribe(
      params => {
        let id = params['id'];
        if(id){
          this.colegiadoService.getColegiado(id).subscribe(
            (colegiado) => {
              this.colegiado = colegiado;
              this.facturas = colegiado.facturas.reverse();
            }
          )
        }
      }
    );
  }

}
