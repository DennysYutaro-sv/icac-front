import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Tramite } from 'src/app/facturas/models/tramite';
import { TramiteService } from 'src/app/tramites/services/tramite.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-multasform',
  templateUrl: './multasform.component.html',
  styleUrls: ['./multasform.component.css'],
  providers: [MessageService]
})
export class MultasformComponent implements OnInit {

  public tramite:Tramite = new Tramite();

  constructor(
    public tramiteService: TramiteService,
    private activatedRoute : ActivatedRoute,
    private router:Router,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.cargarTramite();
  }

  cargarTramite():void{
    this.activatedRoute.params.subscribe(
      params => {
        let id = params['id'];
        if(id){
          this.tramiteService.getTramite(id).subscribe(
            (tramite) => this.tramite = tramite
          )
        }
      }
    );
  }

  create():void{
    if(this.tramite.nombre && this.tramite.descripcion && this.tramite.precio ){
      this.tramite.tipo = 'multa'
      this.tramiteService.saveTramite(this.tramite).subscribe(tramite =>{
        Swal.fire('Nueva multa creada',`Multa ${tramite.nombre}, ha sido creado con éxito!`,'success');
        this.router.navigate(['/multas']);
      });
    }
    else{
      this.showError();
    }
  }
  update(){
    if(this.tramite.nombre && this.tramite.descripcion && this.tramite.precio ){
      this.tramiteService.updateTramite(this.tramite).subscribe(tramite =>{
        Swal.fire('Multa editada',`Multa ${tramite.nombre}, ha sido editada con éxito!`,'success');
        this.router.navigate(['/multas']);
      });
    }
    else{
      this.showError();
    }
  }

  showError() {
    if(!this.tramite.nombre){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'El nombre de la multa es obligatorio, por favor complete.'});
    }
    if(!this.tramite.precio){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'El precio de la multa es obligatorio, por favor complete.'});
    }
    if(!this.tramite.descripcion){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'Por favor, describa la multa.'});
    }
  }

}
