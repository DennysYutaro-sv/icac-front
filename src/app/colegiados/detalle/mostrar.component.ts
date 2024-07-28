import { Component, OnInit } from '@angular/core';
import { Colegiado } from '../colegiado';
import { Factura } from '../../facturas/models/factura';
import { PrimeNGConfig } from 'primeng/api';
import { ColegiadoService } from '../colegiado.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Imagen } from '../imagen';

@Component({
  selector: 'app-mostrar',
  templateUrl: './mostrar.component.html'
})
export class MostrarComponent implements OnInit {

  public colegiado:Colegiado = new Colegiado();

  //public facturas:Factura[] = [];

  imagenA: Imagen= new Imagen();

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
                this.colegiadoService.mostrarImagen(colegiado.colegiatura).subscribe(
                  (imagen) => {
                    if(imagen != undefined){
                      this.imagenA = imagen
                    }
                    else{
                      this.imagenA.colegiadoId = '0'
                    }
                }
                )
              }
          )
        }
      }
    );
  }
}
