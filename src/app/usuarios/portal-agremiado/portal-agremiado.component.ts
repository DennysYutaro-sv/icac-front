import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { AgremiadoService } from './agremiado.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-portal-agremiado',
  templateUrl: './portal-agremiado.component.html',
  providers: [MessageService]
})
export class PortalAgremiadoComponent implements OnInit {

  term:string='';
  credencialAgremiado=[];

  constructor(
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    public agremiadoService: AgremiadoService,
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }
  buscarAgremiado(term:string){
    if(term!=''){
      this.agremiadoService.getAgremiado(term).subscribe(response =>{
        if(response.length>0){
          this.credencialAgremiado.push(response[0][0]);
          this.credencialAgremiado.push(response[0][1]);
          this.credencialAgremiado.push(response[0][2]);
          this.credencialAgremiado.push(response[0][3]);
          this.credencialAgremiado.push(response[0][4]);
          this.credencialAgremiado.push(response[0][5]);
        }
        else{
          Swal.fire('CREDENCIALES NO EXISTE',`Las CREDENCIALES del colegiado: ${term}, no existe en nuestra Base de Datos.`,'warning');
          this.credencialAgremiado = [];
          this.term='';
        }
      })
    }
    else{
      Swal.fire('COLEGIATURA INCORRECTA',`Ingrese una COLEGIATURA correcta.`,'info');
      this.credencialAgremiado = [];
    }
  }
}
