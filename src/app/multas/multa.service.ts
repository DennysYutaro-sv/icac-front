import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { URL_BACKEND } from '../config/config';
import { AuthService } from '../usuarios/auth.service';
import { catchError, Observable, throwError } from 'rxjs';
import { Multa } from './multa';
import { Tramite } from '../facturas/models/tramite';

@Injectable({
  providedIn: 'root'
})
export class MultaService {

  private urlEndPoint:string= URL_BACKEND + "/api";
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json' });

  constructor(
    private http:HttpClient, 
    private router:Router,
    public authService:AuthService
  ) { }

  private agregarAuthorizationHeader(){
    let token = this.authService.token;
    if(token != null){
      return this.httpHeaders.append('Authorization', 'Bearer '+ token);
    }
    return this.httpHeaders;
  }
  private isNoAutorizado(e:any):boolean{
    if(e.status == 401){
      this.router.navigate(['/login'])
      return true;
    }
    if(e.status==403){
      Swal.fire('Acceso denegado',`Usuario ${this.authService.usuario.nombre} ${this.authService.usuario.apellido} no tienes acceso a este recurso!`,'warning');
      this.router.navigate(['/colegiados'])
      return true;
    }
    return false;
  }

  getMultas(term:string='multa'):Observable<Tramite[]>{
    return this.http.get<Tramite[]>(this.urlEndPoint+`/multas/${term}`,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  getMultasAsignadas(term:string):Observable<Multa[]>{
    return this.http.get<Multa[]>(this.urlEndPoint+`/multas/asignados/${term}`,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }
  //Traer multas de un colegiado por colegiatura
  getMultasColegiado(term1:string,term2:number):Observable<Multa[]>{
    return this.http.get<Multa[]>(this.urlEndPoint+`/multas/colegiado/${term1}/${term2}`,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }
  //Actualizar multa de un colegiado
  updateMulta(multa:Multa):Observable<Multa>{
    return this.http.put<Multa>(`${this.urlEndPoint}/multas/colegiado/${multa.id}`,multa,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

}
