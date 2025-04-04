import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Factura } from '../models/factura';
import { Tramite } from '../models/tramite';
import { Router } from '@angular/router';
import { AuthService } from '../../usuarios/auth.service';
import Swal from 'sweetalert2';

import { URL_BACKEND } from 'src/app/config/config';
import { CertificadoHabilidad } from '../models/certificado-habilidad';


@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private urlEndPoint: string = URL_BACKEND + '/api/facturas';
  private urlEndPointAux: string = URL_BACKEND + '/api';
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


  //Obtener factura
  getFactura(id:number):Observable<Factura>{
    return this.http.get<Factura>(`${this.urlEndPoint}/${id}`,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }
  //Crear factura
  create(factura:Factura):Observable<Factura>{
    return this.http.post<Factura>(this.urlEndPoint,factura,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }
  //Extornar factura
  extornar(factura:Factura):Observable<Factura>{
    return this.http.put<Factura>(`${this.urlEndPoint}/${factura.id}`,factura,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }
  //Filtrar tramites
  filtrarTramites(term:string):Observable<Tramite[]>{
    return this.http.get<Tramite[]>(`${this.urlEndPoint}/filtrar-tramites/${term}`,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  //Filtrar cursos
  filtrarCursos(term:string):Observable<Tramite[]>{
    return this.http.get<Tramite[]>(`${this.urlEndPoint}/filtrar-cursos/${term}`,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  //Validar nro de factura
  validarFactura(term:string):Observable<number>{
    return this.http.get<number>(`${this.urlEndPoint}/validar/${term}`,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  //SVDY 08012023 - Validar nro de factura para extornar
  validarExtornoCuota(term:string):Observable<number>{
    return this.http.get<number>(`${this.urlEndPoint}/validar-extorno/${term}`,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  //Traer lista de factura por dia
  listarFacturaPorDia(term1:string,term2:string):Observable<Factura[]>{
    return this.http.get<Factura[]>(`${this.urlEndPoint}/dia/${term1}/${term2}`,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  //SVDY 25022023 - Traer factura por nro de boleta
  getFacturaPorBoleta(term:string):Observable<Factura>{
    return this.http.get<Factura>(`${this.urlEndPoint}/boleta/${term}`,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }
  //Obtener certificado habilidad
  getObtenerCertificadoHabilidad(term1:string,term2:boolean):Observable<CertificadoHabilidad>{
    return this.http.get<CertificadoHabilidad>(`${this.urlEndPointAux}/certificados-habilidad/${term1}/${term2}`,{headers:this.agregarAuthorizationHeader()}).pipe(
      catchError(e=>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }
}
