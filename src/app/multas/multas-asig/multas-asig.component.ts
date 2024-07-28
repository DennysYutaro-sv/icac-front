import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Tramite } from 'src/app/facturas/models/tramite';
import { TramiteService } from 'src/app/tramites/services/tramite.service';
import { Multa } from '../multa';
import { MultaService } from '../multa.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-multas-asig',
  templateUrl: './multas-asig.component.html',
  styleUrls: ['./multas-asig.component.css'],
  providers: [MessageService]
})
export class MultasAsigComponent implements OnInit {
  
  public multa:Tramite = new Tramite();
  public multasAsig:Multa[];
  public tid:string;
  public isDisabled:boolean = false;
  
  constructor(
    private activatedRoute : ActivatedRoute,
    private router:Router,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    public tramiteService: TramiteService,
    public multaService:MultaService
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.cargarMulta();
  }

  cargarMulta():void{
    this.activatedRoute.params.subscribe(
      params => {
        let id = params['id'];
        if(id){
          this.tramiteService.getTramite(id).subscribe(
            (multa) => this.multa = multa
          )
        }
      }
    );
  }
  /*this.multaSerive.getMultas().subscribe(
    (multas) =>{
      this.multas = multas;
    }
  )*/
  cargarMultasAsignadas(tramiteid:number):void{
    
    this.tid = tramiteid.toString();
    this.multaService.getMultasAsignadas(this.tid).subscribe(
      (multasAsig) =>{
        this.multasAsig = multasAsig
        //console.log(this.multasAsig);
        this.isDisabled = true;
      }
    )
    /*
    if(this.multasAsig=[]){
      Swal.fire({
        title: 'Ningún colegiado tiene está multa, por favor verifique.',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      })
    }
    */
    
  }
}
