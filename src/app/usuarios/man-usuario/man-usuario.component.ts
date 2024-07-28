import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../usuario.service';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Usuario } from '../usuario';
import { ManUsuarioService } from './man-usuario.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-man-usuario',
  templateUrl: './man-usuario.component.html',
  providers: [MessageService]
})
export class ManUsuarioComponent implements OnInit {

  usuarios:Usuario[];
  usuario:Usuario;
  usuarioDialog: boolean;
  submitted: boolean;
  statuses: any[];
  letra:string='casa';

  selectedValue: string;
  city: string;
  selectedCategory: any = null;
  categories: any[] = [{name: 'Accounting', key: 'A'}, {name: 'Marketing', key: 'M'}, {name: 'Production', key: 'P'}, {name: 'Research', key: 'R'}];
  //Las filiales ya definidas con su id
  tiposFilial = [{nombre:"CUSCO",valor:1},{nombre:"QUILLABAMBA",valor:2},{nombre:"ESPINAR",valor:3},{nombre:"SANTA MONICA",valor:4}];

  personal:string=""

  constructor(
    public manUsuarioService: ManUsuarioService,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    public authService : AuthService,
    private router:Router,
    
  ) { }

  ngOnInit(): void {
    this.selectedCategory = this.categories[1];
    this.primengConfig.ripple = true;
    this.manUsuarioService.getUsuarios().subscribe((usuarios)=>{
      this.usuarios=usuarios;
      this.personal =  this.authService.usuario.nombre;
    })
    /*
    this.statuses = [
      {label: 'ACTIVO', value: true},
      {label: 'INACTIVO', value: false}
    ];*/
    this.statuses = [{nombre:"femenino"},{nombre:"masculino"}];
  }
  hideDialog() {
    this.usuarioDialog = false;
    this.submitted = false;
  }
  openNew(usu:Usuario) {
    usu.id=1;
    this.usuario.nombre ='';
    this.submitted = false;
    this.usuarioDialog = true;
}

  //Ruta
  rutear(usuario:Usuario){
    this.router.navigate(['/crear-usuario',usuario.id]);    
    const myPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        window.location.reload();
      }, 10);
    });
  }

}
