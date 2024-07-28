import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ColegiadoService } from '../colegiados/colegiado.service';
import { Sistema } from '../colegiados/sistema';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo: string = 'Por favor Inicie Sesión';

  usuario:Usuario;
  sistema:Sistema;
  displayResponsive: boolean=true;

  constructor(public authService:AuthService ,private router:Router, public colegiadoService:ColegiadoService) {
    this.usuario=new Usuario();
   }

  ngOnInit(): void {
    this.colegiadoService.getSistema().subscribe(sis => {
      this.sistema = sis[0];
      this.showResponsiveDialog();
      //console.log(this.sistema);
    })
    if(this.authService.isAuthenticated()){
      
      Swal.fire('Sesión Caducada',`Hola ${this.authService.usuario.nombre} ${this.authService.usuario.apellido}, por favor cierra sesión y vuelve a iniciar sesión!`,'info');
      this.router.navigate(['/login']);
    }
  }
  showResponsiveDialog() {
    this.displayResponsive = true;
  }

  login():void{
    if(this.usuario.username == null || this.usuario.password==null){
      Swal.fire('Error al Iniciar Sesión','Ingrese usuario y contraseña','error');
      return;
    }

    this.authService.login(this.usuario).subscribe(
      response => {
        //console.log(response);
        //convertimos a json
        //let payload = JSON.parse(atob(response.access_token.split(".")[1]));
        //console.log(payload);

        //Guardamos token y usuario
        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);
        let usuario = this.authService.usuario;
        //SVDY 12022023 Si el usuario esta deshabilitado no podra ingresar al sistema
        if(usuario.enabled==false){
          this.authService.logout();
        }
        this.router.navigate(['/colegiados']);
        
        Swal.fire('Éxito en inicio de sesión',`Bienvenido ${usuario.nombre} ${usuario.apellido}, has iniciado sesión con éxito!!`,'success').then(() => {
          window.location.reload();
        });
      },err =>{
        if(err.status == 400){
          Swal.fire('Error al Iniciar Sesión','Usuario o contraseña incorrecta!','error');
        }
      }
    );
  }

}
