import { Component, OnInit } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import { PrimeNGConfig, MessageService, MenuItem } from 'primeng/api';
import { Multa } from './multa';
import { MultaService } from './multa.service';
import { Tramite } from '../facturas/models/tramite';
import { Router } from '@angular/router';

@Component({
  selector: 'app-multas',
  templateUrl: './multas.component.html',
  styleUrls: ['./multas.component.css'],
  providers: [MessageService]
})
export class MultasComponent implements OnInit {

  multas:Tramite[]=[];
  term:string="";
  items: MenuItem[];
  multa:Multa;
  first = 0;
  rows = 10;

  constructor(
    public authService:AuthService,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    public multaSerive:MultaService,
    private router:Router
  ) {
    
   }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.multaSerive.getMultas().subscribe(
      (multas) =>{
        this.multas = multas;
      }
    )
  }

  //Ruta
  rutear(multa:Multa){
    this.router.navigate(['/multas/asignadas',multa.id]);    
    const myPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        window.location.reload();
      }, 10);
    });
  }
  //
  rutearCrear(){
    this.router.navigate(['/multas/form']);    
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
