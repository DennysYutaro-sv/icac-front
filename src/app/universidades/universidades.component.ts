import { Component, OnInit } from '@angular/core';
import { Universidad } from '../colegiados/universidad';
import { AuthService } from '../usuarios/auth.service';
import { UniversidadService } from './universidad.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-universidades',
  templateUrl: './universidades.component.html',
  styleUrls: ['./universidades.component.css']
})
export class UniversidadesComponent implements OnInit {

  universidades:Universidad[]=[];
  first = 0;
  rows = 10;

  constructor(
    public universidadService:UniversidadService,
    public authService: AuthService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.universidadService.getUniversidades().subscribe(
      (response) =>{
        this.universidades = response;
      }
      )
  }
  //Ruta
  rutear(universidad:Universidad){
    this.router.navigate(['/universidades/form',universidad.id]);    
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
