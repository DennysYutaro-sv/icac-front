import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
//PAra consumir peticiones http
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';

import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es';

import { SharedModule } from './shared/shared.module';
import { ColegiadosComponent } from './colegiados/colegiados.component';
import { RouterModule, Routes } from '@angular/router';
import { TramitesComponent } from './tramites/tramites.component';
import { PrimeNgModule } from './prime-ng/prime-ng.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UniversidadesComponent } from './universidades/universidades.component';
import { FormsModule } from '@angular/forms';
import { FormComponent } from './colegiados/form.component';
import { DetalleComponent } from './colegiados/detalle/detalle.component';
import { FacturasComponent } from './facturas/facturas.component';
import { CuotasComponent } from './facturas/cuotas.component';
import { DetalleFacturaComponent } from './facturas/detalle-factura.component';
import { FormTramiteComponent } from './tramites/form-tramite.component';
import { LoginComponent } from './usuarios/login.component';
import { MultasComponent } from './multas/multas.component';
import { MultasformComponent } from './multas/multasform/multasform.component';
import { MultasAsigComponent } from './multas/multas-asig/multas-asig.component';
import { PagosComponent } from './pagos/pagos.component';
import { MultaPagoComponent } from './multas/multa-pago/multa-pago.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { InterceptorService } from './spinner/interceptor.service';
import { FormUniversidadComponent } from './universidades/form-universidad/form-universidad.component';
import { HistorialPagosComponent } from './reportes/historial-pagos/historial-pagos.component';
import { ReporteHabilidadComponent } from './reportes/reporte-habilidad/reporte-habilidad.component';
import { ReporteCobrosComponent } from './reportes/reporte-cobros/reporte-cobros.component';
import { IncorporacionesComponent } from './reportes/incorporaciones/incorporaciones.component';
import { IncorMensualComponent } from './reportes/incor-mensual/incor-mensual.component';
import { ManUsuarioComponent } from './usuarios/man-usuario/man-usuario.component';
import { CrearUsuComponent } from './usuarios/man-usuario/crear-usu.component';
import { CursosComponent } from './cursos/cursos.component';
import { ExtornosComponent } from './extornos/extornos.component';
import { FormCursoComponent } from './cursos/form-curso.component';
import { ShowCursoComponent } from './cursos/show-curso.component';
import { PagoCursosComponent } from './facturas/pago-cursos.component';
import { ReporteExtornosComponent } from './reportes/reporte-extornos/reporte-extornos.component';
import { MostrarComponent } from './colegiados/detalle/mostrar.component';
import { PdfBoletaComponent } from './pdf-boleta/pdf-boleta.component';
import { BuscarFacturaComponent } from './buscar-factura/buscar-factura.component';
import { ReporteCumpleComponent } from './reportes/reporte-cumple/reporte-cumple.component';
import { PortalAgremiadoComponent } from './usuarios/portal-agremiado/portal-agremiado.component';
import { RecordComponent } from './record/record.component';
import { CertificadoComponent } from './certificado/certificado.component';

registerLocaleData(localeES,'es');

const routes: Routes = [
  {path:'',redirectTo: '/login',pathMatch: 'full'},
  {path:'login', component:LoginComponent},
  {path:'colegiados', component:ColegiadosComponent},
  {path: 'universidades',component:UniversidadesComponent},
  {path: 'universidades/form',component:FormUniversidadComponent},
  {path: 'universidades/form/:id',component:FormUniversidadComponent},
  {path: 'colegiados/detalle/:id',component:DetalleComponent},
  //SVDY 10022023 visualizar colegiado
  {path: 'colegiados/mostrar/:id',component:MostrarComponent},
  {path: 'colegiados/form',component:FormComponent},
  {path: 'colegiados/form/:id',component:FormComponent},
  {path: 'facturas/form/:colegiadoId',component:FacturasComponent},
  {path: 'cuotas/form/:colegiadoId',component:CuotasComponent},
  {path: 'facturas/:id',component:DetalleFacturaComponent},
  {path: 'tramites',component:TramitesComponent},
  {path: 'tramites/form',component:FormTramiteComponent},
  {path: 'tramites/form/:id',component:FormTramiteComponent},
  //SVDY 19022023 Ver boletas de cuotas,multas, tramites y cursos
  {path: 'boleta-de-pago/:id',component:PdfBoletaComponent},
  //SVDY 26022023 Buscar Boleta por nro de boleta
  {path: 'buscar-boleta',component:BuscarFacturaComponent},
  //multas
  {path: 'multas',component:MultasComponent},
  {path: 'multas/form',component:MultasformComponent},
  {path: 'multas/asignadas/:id',component:MultasAsigComponent},
  {path: 'multas/pagar/:id',component:MultaPagoComponent},
  //cursos
  {path: 'cursos',component:CursosComponent},
  {path: 'cursos/form',component:FormCursoComponent},
  {path: 'cursos/form/:id',component:FormCursoComponent},
  {path: 'cursos/ver/:id',component:ShowCursoComponent},
  {path: 'cursos/pagar/:colegiadoId',component:PagoCursosComponent},
  //Pagos
  {path: 'pagos/:id',component:PagosComponent},
  //Extornos
  {path: 'extornos',component:ExtornosComponent},
  //Reportes
  {path: 'reportes/historial-pagos',component:HistorialPagosComponent},
  {path: 'reportes/habilidades',component:ReporteHabilidadComponent},
  {path: 'reportes/cobros',component:ReporteCobrosComponent},
  {path: 'reportes/incorporaciones',component:IncorporacionesComponent},
  {path: 'reportes/incorporaciones-mensual',component:IncorMensualComponent},
  {path: 'reportes/extornos',component:ReporteExtornosComponent},
  {path: 'reportes/cumpleanios',component:ReporteCumpleComponent},
  //Usuarios y roles
  {path: 'mantenimiento-usuario',component:ManUsuarioComponent},
  {path: 'crear-usuario',component:CrearUsuComponent},
  {path: 'crear-usuario/:id',component:CrearUsuComponent},
  //Portal del agremiado
  {path: 'portal-agremiado',component:PortalAgremiadoComponent},
  //Record de deudas
  {path: 'record-deudas/:id',component:RecordComponent},
  //Certificado de habilidad
  {path: 'certificado-habilidad',component:CertificadoComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    ColegiadosComponent,
    TramitesComponent,
    UniversidadesComponent,
    FormComponent,
    DetalleComponent,
    FacturasComponent,
    CuotasComponent,
    DetalleFacturaComponent,
    FormTramiteComponent,
    LoginComponent,
    MultasComponent,
    MultasformComponent,
    MultasAsigComponent,
    PagosComponent,
    MultaPagoComponent,
    FormUniversidadComponent,
    HistorialPagosComponent,
    ReporteHabilidadComponent,
    ReporteCobrosComponent,
    IncorporacionesComponent,
    IncorMensualComponent,
    ManUsuarioComponent,
    CrearUsuComponent,
    CursosComponent,
    ExtornosComponent,
    FormCursoComponent,
    ShowCursoComponent,
    PagoCursosComponent,
    ReporteExtornosComponent,
    MostrarComponent,
    PdfBoletaComponent,
    BuscarFacturaComponent,
    ReporteCumpleComponent,
    PortalAgremiadoComponent,
    RecordComponent,
    CertificadoComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    PrimeNgModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    {provide: LOCALE_ID,useValue: 'es'},
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorService,multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
