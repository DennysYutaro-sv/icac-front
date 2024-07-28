import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { Universidad } from '../colegiados/universidad';
import { AuthService } from '../usuarios/auth.service';
import Swal from 'sweetalert2';
import { URL_BACKEND } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class UniversidadService {

  private urlEndPoint:string= URL_BACKEND + "/api/colegiados";
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

  getUniversidades():Observable<Universidad[]>{
    return this.http.get<Universidad[]>(this.urlEndPoint+`/universidades`,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  getUniversidad(id:number):Observable<Universidad>{
    return this.http.get<Universidad>(`${this.urlEndPoint}/universidades/${id}`,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  saveUniversidad(universidad:Universidad):Observable<Universidad>{
    return this.http.post<Universidad>(this.urlEndPoint+`/universidades`,universidad,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  updateUniversidad(universidad:Universidad):Observable<Universidad>{
    return this.http.put<Universidad>(`${this.urlEndPoint}/universidades/${universidad.id}`,universidad,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }
}
