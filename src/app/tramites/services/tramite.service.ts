import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Tramite } from '../../facturas/models/tramite';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../usuarios/auth.service';
import Swal from 'sweetalert2';
import { URL_BACKEND } from 'src/app/config/config';


@Injectable({
  providedIn: 'root'
})
export class TramiteService {

  private urlEndPoint: string = URL_BACKEND + '/api/tramites';
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

  getTramite(id:number):Observable<Tramite>{
    return this.http.get<Tramite>(`${this.urlEndPoint}/${id}`,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  getTramites():Observable<Tramite[]>{
    return this.http.get<Tramite[]>(`${this.urlEndPoint}`,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }
  getTramites1(term:string):Observable<Tramite[]>{
    this.urlEndPoint = URL_BACKEND + '/api';
    return this.http.get<Tramite[]>(this.urlEndPoint+`/multas/${term}`,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  saveTramite(tramite:Tramite):Observable<Tramite>{
    return this.http.post<Tramite>(this.urlEndPoint,tramite,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  updateTramite(tramite:Tramite):Observable<Tramite>{
    return this.http.put<Tramite>(`${this.urlEndPoint}/${tramite.id}`,tramite,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

}
