import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Usuario } from '../usuario';
import { UsuarioService } from '../usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ManUsuarioService } from './man-usuario.service';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-crear-usu',
  templateUrl: './crear-usu.component.html',
  providers: [MessageService]
})
export class CrearUsuComponent implements OnInit {

  public usuario:Usuario = new Usuario();
  //Las filiales ya definidas con su id
  tiposFilial = [{nombre:"CUSCO",valor:1},{nombre:"QUILLABAMBA",valor:2},{nombre:"ESPINAR",valor:3},{nombre:"SANTA MONICA",valor:4}];
  activos = [{nombre:"ACTIVO",valor:1},{nombre:"INACTIVO",valor:0}];
  checked: string = '¿Está ACTIVO?';

  roles: any[] = [{name: ' Rol Administrador',valor:'ROLE_ADMIN', key: 2}, {name: ' Rol Cajero',valor:'ROLE_CAJA', key: 3}, {name: ' Rol Mesa de Partes',valor:'ROLE_PARTES', key: 4}, {name: ' Rol decano',valor:'ROLE_DECANO', key: 5}];
  rolesCargar = []

  selectedRol: any = null;
  idSelected: any;

  constructor(
    public manUsuarioService: ManUsuarioService,
    private activatedRoute : ActivatedRoute,
    private router:Router,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    public authService:AuthService,
  ) { }

  ngOnInit(): void {
    console.log(this.usuario)
    this.primengConfig.ripple = true;
    this.cargarUsuario();
    //this.selectedRol = this.roles[1];
  }

  cargarUsuario():void{
    this.activatedRoute.params.subscribe(
      params => {
        let id = params['id'];
        if(id){
          this.manUsuarioService.getUsuario(id).subscribe(
            (usuario) => 
            {
              this.usuario = usuario
              this.rolesCargar = this.usuario.roles
            }
          )
        }
        else{
          this.usuario.dni = ''
        }
      }
    );
  }
  create():void{
    //svdy
    if(this.authService.hasRole('ROLE_USER') && this.usuario.dni.toString().length==8 && this.selectedRol && this.usuario.username && this.usuario.nombre && this.usuario.apellido && this.usuario.dni && this.usuario.email && this.usuario.password && this.usuario.filial && (this.usuario.enabled ==true ||this.usuario.enabled ==false)){
      this.usuario.roles = [{id: 1, nombre: 'ROLE_USER'},{id: this.selectedRol.key, nombre: this.selectedRol.valor}]
      this.manUsuarioService.saveUsuario(this.usuario).subscribe(usuario =>{
        Swal.fire('Nuevo usuario creado',`Usuario ${usuario.nombre}, ha sido creado con éxito!`,'success');
        this.router.navigate(['/mantenimiento-usuario']);
      });
    }
    else{
      this.showError();
    }
  }

 
  update(){
    if(this.authService.hasRole('ROLE_USER') && this.usuario.dni.toString().length==8 && this.selectedRol && this.usuario.username && this.usuario.nombre && this.usuario.apellido && this.usuario.dni && this.usuario.email && this.usuario.password && this.usuario.filial && (this.usuario.enabled ==true ||this.usuario.enabled ==false)){
      this.usuario.roles = [{id: 1, nombre: 'ROLE_USER'},{id: this.selectedRol.key, nombre: this.selectedRol.valor}]
      this.manUsuarioService.updateUsuario(this.usuario).subscribe(usuario =>{
        Swal.fire('Usuario editado',`Usuario ${usuario.nombre}, ha sido editado con éxito!`,'success');
        this.router.navigate(['/mantenimiento-usuario']);
      });
    }
    else{
      this.showError();
    }
  }

  showError() {
    if(!this.usuario.nombre){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'El nombre del usuario es obligatorio, por favor complete.'});
    }
    if(!this.usuario.apellido){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'El apellido del usuario es obligatorio, por favor complete.'});
    }
    if(!this.usuario.username){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'El username del usuario es obligatorio, por favor complete.'});
    }
    if(!this.usuario.email){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'El correo del usuario es obligatorio, por favor complete.'});
    }
    if(!this.usuario.dni){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'El DNI del usuario es obligatorio, por favor complete.'});
    }
    if(!this.usuario.filial){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'La filial del usuario es obligatorio, por favor complete.'});
    }
    if(!this.usuario.enabled){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'La estado del usuario es obligatorio, por favor complete.'});
    }
    if(!this.selectedRol){
      this.messageService.add({severity:'warn', summary: 'Error: Elija el ROL', detail: 'El ROL del usuario es obligatorio, por favor complete.'});
    }
    if(this.usuario.dni.length != 8){
      this.messageService.add({severity:'warn', summary: 'Error: DNI incorrecto', detail: 'El DNI del usuario tiene un formato incorrecto, por favor corrija.'});
    }
  }

}
