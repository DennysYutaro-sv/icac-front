import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { URL_BACKEND } from 'src/app/config/config';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgremiadoService {
  private urlEndPoint: string = URL_BACKEND + '/api';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json' });
  constructor(
    private http: HttpClient,
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
  getAgremiado(colegiatura:string):Observable<any>{
    return this.http.get<any>(`${this.urlEndPoint}/agremiado/${colegiatura}`,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }
}
