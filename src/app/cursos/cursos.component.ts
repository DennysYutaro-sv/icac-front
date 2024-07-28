import { Component, OnInit } from '@angular/core';
import { TramiteService } from '../tramites/services/tramite.service';
import { AuthService } from '../usuarios/auth.service';
import { Router } from '@angular/router';
import { Tramite } from '../facturas/models/tramite';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html'
})
export class CursosComponent implements OnInit {

  tramites: Tramite[] = [];
  displayMaximizable: boolean;
  first = 0;
  rows = 10;

  constructor(
    public tramiteService:TramiteService,
    public authService:AuthService,
    private router:Router,
  ) { }

  ngOnInit(): void {
    this.tramiteService.getTramites1('curso').subscribe(
      (tramites) =>{
        this.tramites = tramites;
      }
    )
  }

//Ruta
rutear(tramite:Tramite){
  this.router.navigate(['/cursos/form',tramite.id]);    
  const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      window.location.reload();
    }, 10);
  });
}

rutearVer(tramite:Tramite){
  this.router.navigate(['/cursos/ver',tramite.id]);    
  const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      window.location.reload();
    }, 10);
  });
}

rutearCrear(){
  this.router.navigate(['/cursos/form']);    
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
