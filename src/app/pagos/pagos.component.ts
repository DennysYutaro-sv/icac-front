import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { ColegiadoService } from '../colegiados/colegiado.service';
import { Factura } from '../facturas/models/factura';
import { Colegiado } from '../colegiados/colegiado';
import { Multa } from '../multas/multa';
import { MultaService } from '../multas/multa.service';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css'],
  providers: [MessageService]
})
export class PagosComponent implements OnInit {

  factura:Factura = new Factura();
  colegiado:Colegiado;
  //---Para control de fechas cuotas----
  fechaHastaDondePago= new Date();
  fechaColegiaturaAbs= new Date();
  fechaActual = new Date();
  mesesDeuda:number = 0;

  dateFrom = new Date();
  dateTo = new Date();
  //-------------------------------------
  //-- Para control de multas de un colegiado --
  multas:Multa[];


  constructor(
    private primengConfig: PrimeNGConfig,
    private activatedRoute:ActivatedRoute,
    public colegiadoService: ColegiadoService,
    public MultaService: MultaService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.activatedRoute.paramMap.subscribe(params =>{
      let colegiadoId = +params.get('id')!;
      this.colegiadoService.getColegiado(colegiadoId).subscribe(
        (colegiado) => {
          this.colegiado = colegiado;
          //console.log('colegiatura ',this.colegiado.colegiatura);
          //Obtenemos las multas del colegiado
          this.MultaService.getMultasColegiado(this.colegiado.colegiatura,0).subscribe((multas)=>
            {
              this.multas=multas;
              //console.log(this.multas)
              //console.log('multas ahora ',this.multas);
            });
          
          //Obtenemos las fechas hasta donde pago el colegiado
          let verificarFacturas:Factura[] = colegiado.facturas.filter(f =>{
            //SVDY 070123 filtramos facturas no extornadas
            return f.tipo == 'cuota' && f.cancelado == false;
          });

          let v = this.validar01(colegiado.fechaColegiatura);

          colegiado.fechaColegiatura = v;

          this.fechaColegiaturaAbs = new Date(colegiado.fechaColegiatura);
          //console.log(this.fechaColegiaturaAbs)
          this.calcularDeuda(this.fechaColegiaturaAbs,verificarFacturas);
        }
        );
      
    });
  }
    //Validar si es 01 de cualquier mes
    validar01(colegiaturaFecha:string):any{
      if(colegiaturaFecha.substring(8,10) == '01' ){
        //console.log(colegiaturaFecha.substring(0,8));
        let fechaValida = colegiaturaFecha.substring(0,8).concat('15')
        return fechaValida;
      }
      else{
        return colegiaturaFecha;
      }
    }
      //Calcular deuda
  calcularDeuda(colegiaturaFecha:Date,verificarFacturas:Factura[]):void{
    this.dateFrom.setDate(15);
    this.dateTo.setDate(15);
    //console.log('actual: ',this.fechaActual);
    if(verificarFacturas.length ==0){
      this.fechaHastaDondePago.setDate(15);
      this.fechaHastaDondePago.setMonth(colegiaturaFecha.getMonth());
      this.fechaHastaDondePago.setFullYear(colegiaturaFecha.getFullYear());

      //Calcamos mese de deuda
      this.dateFrom.setMonth(this.fechaHastaDondePago.getMonth());
      this.dateFrom.setFullYear(this.fechaHastaDondePago.getFullYear());

      this.mesesDeuda = this.diferenciaMeses(this.dateFrom,this.dateTo);
      //console.log('zzz',this.mesesDeuda);
    }
    else{
      this.fechaHastaDondePago = new Date(verificarFacturas[verificarFacturas.length-1].fechaHasta);
      //Lo obligo que sea 15
      this.fechaHastaDondePago.setDate(15);
      //Calcamos mese de deuda
      this.dateFrom.setMonth(this.fechaHastaDondePago.getMonth());
      this.dateFrom.setFullYear(this.fechaHastaDondePago.getFullYear());
      this.mesesDeuda = this.diferenciaMeses(this.dateFrom,this.dateTo);
      //console.log('zzz',this.mesesDeuda);

      //console.log("Que psa: ",this.fechaHastaDondePago);
    }
  }
  //Calcular meses entre 2 fechas
  diferenciaMeses(dateFrom:Date, dateTo:Date) { 

    return dateTo.getMonth() - dateFrom.getMonth() + (12 * (dateTo.getFullYear() - dateFrom.getFullYear())) 
  }

  //Ruteamos las multas, cuotas y tramites
  //Ruta factura multas
  rutearFacturaMulta(colegiado:Colegiado){
    this.router.navigate(['/multas/pagar',colegiado.id]);    
    const myPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        window.location.reload();
      }, 10);
    });
  }

  //Ruta factura cuotas
  rutearFacturaCuota(colegiado:Colegiado){
    this.router.navigate(['/cuotas/form',colegiado.id]);    
    const myPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        window.location.reload();
      }, 10);
    });
  }

  //Ruta factura tramites
  rutearFacturaTramite(colegiado:Colegiado){
    this.router.navigate(['/facturas/form',colegiado.id]);    
    const myPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        window.location.reload();
      }, 10);
    });
  }

  //Ruta record deudas
  rutearRecordDeudas(colegiado:Colegiado){
    this.router.navigate(['/record-deudas',colegiado.id]);    
    const myPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        window.location.reload();
      }, 10);
    });
  }

}
