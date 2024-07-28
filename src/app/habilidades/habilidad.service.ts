import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { Habilidad } from '../colegiados/habilidad';
import { AuthService } from '../usuarios/auth.service';
import Swal from 'sweetalert2';
import { URL_BACKEND } from '../config/config';


@Injectable({
  providedIn: 'root'
})
export class HabilidadService {

  private urlEndPoint:string= URL_BACKEND + "/api/colegiados";
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json' });

  private urlExterna: string = `https://dniruc.apisperu.com/api/v1/dni/`
  private tokenExterno: string = `?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Inl1dGFyb3Jrb0BnbWFpbC5jb20ifQ.96urCEnWLtx3gRbW2BrG4_nE86naXEBUApW1eskEfvs`;

  constructor(private http:HttpClient, private router:Router,public authService:AuthService) { }

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

  getHabilidades():Observable<Habilidad[]>{
    return this.http.get<Habilidad[]>(this.urlEndPoint+`/habilidades`,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }
  //MEtodo de prueba
  getDni(dni:string):Observable<any>{
    return this.http.get<any>(this.urlExterna+`${dni}`+this.tokenExterno).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }
}
