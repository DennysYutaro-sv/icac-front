import { Component, OnInit } from '@angular/core';
import { Tramite } from '../facturas/models/tramite';
import { TramiteService } from './services/tramite.service';
import { AuthService } from '../usuarios/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tramites',
  templateUrl: './tramites.component.html',
  styleUrls: ['./tramites.component.css']
})
export class TramitesComponent implements OnInit {

  tramites: Tramite[] = [];
  displayMaximizable: boolean;
  first = 0;
  rows = 10;
  c=0;
  n=0;

  tramitex:Tramite =
  {
    id:0,
    nombre:'',
    descripcion:'',
    precio:0,
    tipo:''
  };

  constructor(
    public tramiteService:TramiteService,
    public authService:AuthService,
    private router:Router,
  ) { }

  ngOnInit(): void {
    this.tramiteService.getTramites1('tramite').subscribe(
      (tramites) =>{
        this.tramites = tramites;
        tramites.forEach((t) => {
          this.c=this.c+1
          t.modalidad=this.c.toString();
        });
      }
    )
  }
  //Mostrar
  showMaximizableDialog(tramite:Tramite) {
    //this.tramitex.id = tramite.id;
    this.tramitex = tramite;
    this.displayMaximizable = true;
    
    
}
//Ruta
rutear(tramite:Tramite){
  this.router.navigate(['/tramites/form',tramite.id]);    
  const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      window.location.reload();
    }, 10);
  });
}

rutearCrear(){
  this.router.navigate(['/tramites/form']);    
  const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      window.location.reload();
    }, 10);
  });
}
next() {
  this.first = this.first + this.rows;
}

prev() {
    this.first = this.first - this.rows;
}

reset() {
    this.first = 0;
}
}
