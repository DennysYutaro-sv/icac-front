import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Universidad } from '../../colegiados/universidad';
import { UniversidadService } from '../universidad.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-universidad',
  templateUrl: './form-universidad.component.html',
  providers: [MessageService]
})
export class FormUniversidadComponent implements OnInit {

  public universidad: Universidad = new Universidad();

  constructor(
    public universidadService:UniversidadService,
    private activatedRoute : ActivatedRoute,
    private router:Router,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.cargarUniversidad();
  }

  cargarUniversidad():void{
    this.activatedRoute.params.subscribe(
      params => {
        let id = params['id'];
        if(id){
          this.universidadService.getUniversidad(id).subscribe(
            (universidad) => 
            {
              this.universidad = universidad
            }
          )
        }
      }
    );
  }

  create():void{
    if(this.universidad.nombre && this.universidad.descripcion ){
      this.universidadService.saveUniversidad(this.universidad).subscribe(universidad =>{
        Swal.fire('Nueva universidad creada',`Universidad ${universidad.nombre}, ha sido creada con éxito!`,'success');
        this.router.navigate(['/universidades']);
      });
    }
    else{
      this.showError();
    }
  }
  update(){
    if(this.universidad.nombre && this.universidad.descripcion ){
      this.universidadService.updateUniversidad(this.universidad).subscribe(universidad =>{
        Swal.fire('Universidad editada',`Universidad ${universidad.nombre}, ha sido editada con éxito!`,'success');
        this.router.navigate(['/universidades']);
      });
    }
    else{
      this.showError();
    }
  }

  showError() {
    if(!this.universidad.nombre){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'El nombre de la universidad es obligatorio, por favor complete.'});
    }
    if(!this.universidad.descripcion){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'Por favor, describa la universidad.'});
    }
  }
}
