import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Tramite } from '../facturas/models/tramite';
import { Router, ActivatedRoute } from '@angular/router';
import { TramiteService } from '../tramites/services/tramite.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-curso',
  templateUrl: './form-curso.component.html',
  providers: [MessageService]
})
export class FormCursoComponent implements OnInit {

  public tramite:Tramite = new Tramite();
  modalidades = [{nombre:"Presencial"},{nombre:"Semipresencial"},{nombre:"Clases Virtuales"}];

  //stateOptions: any[];
  stateOptions = [{label: 'ACTIVO', value: true}, {label: 'DESACTIVO', value: false}];

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
            }
          )
        }
      }
    );
  }
  create(){
    if(this.tramite.nombre && this.tramite.descripcion && this.tramite.precio
      && this.tramite.ponente && this.tramite.modalidad && this.tramite.inicio
      && this.tramite.fin && this.tramite.duracion && this.tramite.horario){
      this.tramite.tipo = "curso"
      this.tramite.cancelado = true;
      this.tramiteService.saveTramite(this.tramite).subscribe(tramite =>{
        Swal.fire('Nuevo curso/diplomado creado',`Curso / Diplomado ${tramite.nombre}, ha sido creado con éxito!`,'success');
        this.router.navigate(['/cursos']);
      });
    }
    else{
      this.showError();
    }
  }
  update(){
    if(this.tramite.nombre && this.tramite.descripcion && this.tramite.precio
      && this.tramite.ponente && this.tramite.modalidad && this.tramite.inicio
      && this.tramite.fin && this.tramite.duracion && this.tramite.horario ){
      if(this.tramite.cancelado!=true){
        this.tramite.cancelado = false
      }
      this.tramite.tipo = "curso"
      this.tramiteService.updateTramite(this.tramite).subscribe(tramite =>{
        Swal.fire('Curso editado',`Curso / Diplomado ${tramite.nombre}, ha sido editado con éxito!`,'success');
        this.router.navigate(['/cursos']);
      });
    }
    else{
      this.showError();
    }
  }

  showError() {
    if(!this.tramite.nombre){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'El nombre del curso/diplomado es obligatorio, por favor complete.'});
    }
    if(!this.tramite.precio){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'El precio del curso/diplomado es obligatorio, por favor complete.'});
    }
    if(!this.tramite.descripcion){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'Por favor, describa el curso/diplomado.'});
    }
    if(!this.tramite.ponente){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'El nombre del Ponente es obligatorio, por favor complete.'});
    }
    if(!this.tramite.modalidad){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'La modalidad del curso/diplomado es obligatorio, por favor complete.'});
    }
    if(!this.tramite.imagen){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'El URL de la imagen es obligatorio, por favor complete.'});
    }
    if(!this.tramite.inicio){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'La fecha inicio del curso/diplomado es obligatorio, por favor complete.'});
    }
    if(!this.tramite.fin){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'La fecha fin del curso/diplomado es obligatorio, por favor complete.'});
    }
    if(!this.tramite.duracion){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'La duración del curso/diplomado es obligatorio, por favor complete.'});
    }
    if(!this.tramite.horario){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'El horario del curso/diplomado es obligatorio, por favor complete.'});
    }
  }

}
