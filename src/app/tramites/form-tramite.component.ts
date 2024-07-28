import { Component, OnInit } from '@angular/core';
import { Tramite } from '../facturas/models/tramite';
import { TramiteService } from './services/tramite.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import {MessageService} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-form-tramite',
  templateUrl: './form-tramite.component.html',
  providers: [MessageService]
})
export class FormTramiteComponent implements OnInit {

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
            (tramite) => 
            {
              this.tramite = tramite
            }
          )
        }
      }
    );
  }

  create():void{
    if(this.tramite.nombre && this.tramite.descripcion && this.tramite.precio ){
      this.tramite.tipo = "tramite"
      this.tramiteService.saveTramite(this.tramite).subscribe(tramite =>{
        Swal.fire('Nueva tramite creado',`Tramite ${tramite.nombre}, ha sido creado con éxito!`,'success');
        this.router.navigate(['/tramites']);
      });
    }
    else{
      this.showError();
    }
  }
  update(){
    if(this.tramite.nombre && this.tramite.descripcion && this.tramite.precio ){
      this.tramiteService.updateTramite(this.tramite).subscribe(tramite =>{
        if(this.tramite.id!=1){
          Swal.fire('Tramite editado',`Tramite ${tramite.nombre}, ha sido editado con éxito!`,'success');
          this.router.navigate(['/tramites']);
        }
        else{
          Swal.fire('Cuota mensual fue editado',`Cuota mensual del colegio de abogados ha sido editado con éxito!`,'success');
          this.router.navigate(['/colegiados']);
        }
      });
    }
    else{
      this.showError();
    }
  }

  showError() {
    if(!this.tramite.nombre){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'El nombre del tramite es obligatorio, por favor complete.'});
    }
    if(!this.tramite.precio){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'El precio del tramite es obligatorio, por favor complete.'});
    }
    if(!this.tramite.descripcion){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'Por favor, describa el tramite.'});
    }
  }
}
