import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Universidad } from './universidad';
import { Habilidad } from './habilidad';
import { UniversidadService } from '../universidades/universidad.service';
import { HabilidadService } from '../habilidades/habilidad.service';
import { Colegiado } from './colegiado';
import { ColegiadoService } from './colegiado.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import {MessageService} from 'primeng/api';
import { Imagen } from './imagen';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  providers: [MessageService]
})
export class FormComponent implements OnInit {

  @ViewChild('imagenInputFile', {static: false}) imagenFile: ElementRef;

  public colegiado:Colegiado = new Colegiado();
  public errores: string[];

  tiposSexo = [{nombre:"femenino"},{nombre:"masculino"}];

  fechaNacimiento: Date;
  fechaColegiatura: Date;

  universidades: Universidad[];
  selectedUniversidad : Universidad;

  habilidades :Habilidad[];
  selectedHabilidad: Habilidad;

  nroColegiatura:string;

  dniConsulta:string='';

  imagen: File;
  imagenMin: File;
  imagenA: Imagen= new Imagen();
  exito=false;

  constructor(
    private primengConfig: PrimeNGConfig,
    public universidadService :UniversidadService,
    public habilidadService : HabilidadService,
    public colegiadoService : ColegiadoService,
    private router:Router,
    private messageService: MessageService,
    private activatedRouter: ActivatedRoute,
    //SVDY 12022023 validamos authService
    public authService:AuthService,
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.cargarColegiado();

    this.universidadService.getUniversidades().subscribe(
      (response) => {
        this.universidades = response;
      }
    );

    this.habilidadService.getHabilidades().subscribe(
      (response) => {
        this.habilidades = response;
      }
    );

  }

  consultarReniec(dni:string){
    if(dni.length == 8){
      this.habilidadService.getDni(dni).subscribe(
        (r) =>{
          if(r.message){
            Swal.fire({
              title: 'RENIEC: DNI no encontrado',
              text: 'DNI no encontrado, por favor verifique.',
              imageUrl: '/assets/reniec.png',
              imageWidth: 350,
              imageHeight: 150,
              imageAlt: 'reniec',
            })
            this.dniConsulta = '';
            this.colegiado.dni = '';
            this.colegiado.nombre = '';
            this.colegiado.apellido = '';
          }
          else {
            this.colegiado.dni = r.dni;
            this.colegiado.nombre = r.nombres;
            this.colegiado.apellido = r.apellidoPaterno+' '+r.apellidoMaterno
            //Swal.fire('RENIEC: DNI encontrado','¿Cargar datos?','success');
            Swal.fire({
              title: 'RENIEC: DNI encontrado',
              text: 'Persona: '+r.nombres +' '+ r.apellidoPaterno+' '+r.apellidoMaterno+' - '+r.dni,
              imageUrl: '/assets/reniec.png',
              imageWidth: 350,
              imageHeight: 150,
              imageAlt: 'reniec',
            });
          }
        }
      )
    }
    else{
      Swal.fire('DNI incorrecto','Verifique el número de DNI','warning');
      this.dniConsulta = '';
      this.colegiado.dni = '';
      this.colegiado.nombre = '';
      this.colegiado.apellido = '';
    } 
  }
  onKeyUp(dni) { 
    //this.consultarReniec = dni.target.value
    this.consultarReniec(dni);
  }

  cargarColegiado():void{
    
    this.activatedRouter.params.subscribe(
      params => {
        let id = params['id'];
        if(id){
          this.colegiadoService.getColegiado(id).subscribe(
            (colegiado) => {
              this.colegiado = colegiado
              console.log("id :"+colegiado.imagenId)
              this.colegiadoService.mostrarImagen(colegiado.colegiatura).subscribe(
                (imagen) => {
                  if(imagen != undefined){
                    this.imagenA = imagen
                  }
                  else{
                    this.imagenA.colegiadoId = '0'
                  }
                  //console.log("id :"+colegiado.imagenId)
              }
              )
          }
          )
        
        }
        else{
          this.colegiadoService.getUltimoColegiado().subscribe(
            (colegiado) => {
              this.colegiado.colegiatura =  (+(colegiado.colegiatura) + 1).toString();
            }
          )

        }
      }
    );
  }

  create():void{
    this.colegiado.actualizador = this.authService.usuario.nombre + ' ' + this.authService.usuario.apellido;
    this.colegiadoService.create(this.colegiado).subscribe(
      colegiado =>{
        this.exito = true;
        this.colegiado=colegiado;
        if(this.exito == true && this.imagen!= undefined){
          this.colegiadoService.uploadImagen(this.imagen,this.colegiado.colegiatura).subscribe(
            imagen => {
              this.router.navigate(['/colegiados']);
              Swal.fire("Nuevo colegiado", `El colegiado : ${this.colegiado.nombre}   ${this.colegiado.apellido} ha sido registrado con éxito!!`,'success');
            },
            err => {
              alert(err.error.mensaje);
              //this.spinner.hide();
              this.reset();
            }
          );
        }
        else{
          if(this.exito == true){
              this.router.navigate(['/colegiados']);
              Swal.fire("Nuevo colegiado", `El colegiado : ${this.colegiado.nombre}   ${this.colegiado.apellido} ha sido registrado con éxito!!`,'success');
          }
        }
      },
      err => {
        this.exito = false;
        this.errores = err.error.Errors as string[];
        this.messageService.clear();
        this.messageService.add({key: 'c', sticky: true, severity:'warn', summary:'Error al registrar colegiado', detail:this.errores.toString()});
        console.error('Error desde el backend :', +err.status);
        console.error(err.error.Errors);
      }
    );
  }
  updateImagen():void{
    this.colegiadoService.deleteImagen(Number(this.imagenA.id)).subscribe(
      response => {
        
        Swal.fire('Foto eliminada correctamente',`La foto del colegiado: ${this.colegiado.nombre} ${this.colegiado.apellido} fue eliminado.`,'success');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    )
  }
  update():void{
    //this.colegiado.facturas = null;
    //this.colegiado.resoluciones=null;
    this.colegiado.actualizador = this.authService.usuario.nombre + ' ' + this.authService.usuario.apellido;
    this.colegiadoService.update(this.colegiado).subscribe(
      json => {
        if(this.imagenA.colegiadoId=='0' && this.imagen!= undefined){
          this.colegiadoService.uploadImagen(this.imagen,this.colegiado.colegiatura).subscribe(
            imagen => {
              //this.router.navigate(['/colegiados']);
              this.router.navigate(['/colegiados/mostrar',this.colegiado.id]);
              Swal.fire('Colegiado Actualizado',`${json.Mensaje}: ${json.Colegiado.nombre} ${json.Colegiado.apellido}`,'success');
              
              
            },
            err => {
              alert(err.error.mensaje);
              //this.spinner.hide();
              this.reset();
            }
          );
        }
        else{
          //[routerLink]="['/colegiados/mostrar',colegiado.id]" 
          this.router.navigate(['/colegiados/mostrar',this.colegiado.id]);
          Swal.fire('Colegiado Actualizado',`${json.Mensaje}: ${json.Colegiado.nombre} ${json.Colegiado.apellido}`,'success');
        }
        //Swal.fire('Colegiado Actualizado',`${json.Mensaje}: ${json.Colegiado.nombre} ${json.Colegiado.apellido}`,'success');
      }
    )

  }

onFileChange(event) {
  const MAXIMO_TAMANIO_BYTES = 100000;
  this.imagen = event.target.files[0];
  if (this.imagen.size > MAXIMO_TAMANIO_BYTES) {
		const tamanioEnMb = MAXIMO_TAMANIO_BYTES / 1000000;
		Swal.fire("Imagen muy grande", `Por favor redimensionar la imagen(Max. 100 kbs).`,'warning');
		// Limpiar
    this.imagen = null;
    this.imagenMin = null;
    this.imagenFile.nativeElement.value = '';
	}
  const fr = new FileReader();
  fr.onload = (evento: any) => {
    this.imagenMin = evento.target.result;
  };
  fr.readAsDataURL(this.imagen);
}
/*
onUpload(): void {
  //this.spinner.show();
  this.colegiadoService.uploadImagen(this.imagen).subscribe(
    data => {
      //this.spinner.hide();
      this.router.navigate(['/']);
    },
    err => {
      alert(err.error.mensaje);
      //this.spinner.hide();
      this.reset();
    }
  );
}
*/
reset(): void {
  this.imagen = null;
  this.imagenMin = null;
  this.imagenFile.nativeElement.value = '';
}


  //Toast
  showConfirm() {
    this.messageService.clear();
    this.messageService.add({key: 'c', sticky: true, severity:'warn', summary:'Are you sure?', detail:'Confirm to proceed'});
  }
  onConfirm() {
    this.messageService.clear('c');
  }

  onReject() {
      this.messageService.clear('c');
  }
}
