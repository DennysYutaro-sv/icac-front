import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig, MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { TramiteService } from '../tramites/services/tramite.service';
import { Tramite } from '../facturas/models/tramite';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-show-curso',
  templateUrl: './show-curso.component.html',
  providers: [MessageService]
})
export class ShowCursoComponent implements OnInit {

  public tramite:Tramite = new Tramite();
  modalidades = [{nombre:"Presencial"},{nombre:"Semipresencial"},{nombre:"Clases Virtuales"}];

  stateOptions = [{label: 'ACTIVO', value: true}, {label: 'DESACTIVO', value: false}];
  estado:string;
  constructor(
    private primengConfig: PrimeNGConfig,
    private router:Router,
    private messageService: MessageService,
    private activatedRouter: ActivatedRoute,
    private tramiteService:TramiteService,
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.cargarCurso();
  }

  cargarCurso():void{
    this.activatedRouter.params.subscribe(
      params => {
        let id = params['id'];
        if(id){
          this.tramiteService.getTramite(id).subscribe(
            (tramite) => 
            {
              this.tramite = tramite
              this.tramite.inicio = tramite.inicio.substring(0,11)
              this.tramite.inicio = tramite.fin.substring(0,11)
              if (tramite.cancelado = true) this.estado='ACTIVO'
              else this.estado='DESACTIVO'
            }
          )
        }
      }
    );
  }
}
