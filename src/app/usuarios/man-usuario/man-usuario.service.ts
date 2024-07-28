import { Injectable } from '@angular/core';
import { URL_BACKEND } from '../../config/config';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { catchError, Observable, throwError } from 'rxjs';
import { Usuario } from '../usuario';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ManUsuarioService {

  private urlEndPoint:string = URL_BACKEND + '/api';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json' });

  constructor(private http:HttpClient, private router:Router,public authService:AuthService) { }

  private agregarAuthorizationHeader(){
    let token = this.authService.token;
    if(token != null){
      return this.httpHeaders.append('Authorization', 'Bearer '+ token);
    }
    return this.httpHeaders;
  }
  private isNoAutorizado(e:any):boolean{
    if(e.status == 401 ){
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

  getUsuario(id:number):Observable<Usuario>{
    return this.http.get<Usuario>(`${this.urlEndPoint}/usuario/${id}`,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  getUsuarios():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.urlEndPoint+`/usuarios`,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  saveUsuario(usuario:Usuario):Observable<Usuario>{
    return this.http.post<Usuario>(this.urlEndPoint+`/usuario/crear`,usuario,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  updateUsuario(usuario:Usuario):Observable<Usuario>{
    return this.http.put<Usuario>(`${this.urlEndPoint}/usuario/${usuario.id}`,usuario,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }
}
