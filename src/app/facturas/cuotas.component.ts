import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { ColegiadoService } from '../colegiados/colegiado.service';
import { Factura } from './models/factura';
import { ActivatedRoute, Router } from '@angular/router';
import { FacturaService } from './services/factura.service';
import { ItemFactura } from './models/item-factura';
import Swal from 'sweetalert2';
import {Message,MessageService} from 'primeng/api';
import { Tramite } from './models/tramite';
import { TramiteService } from '../tramites/services/tramite.service';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-cuotas',
  templateUrl: './cuotas.component.html',
  styleUrls: ['./cuotas.component.css'],
  providers: [MessageService]
})
export class CuotasComponent implements OnInit {

  factura:Factura = new Factura();

  fechaHastaDondePago= new Date();
  fechaColegiaturaAbs= new Date();
  fechaActual = new Date();
  mesesDeuda:number = 0;

  dateFrom = new Date();
  dateTo = new Date();

  tiposPagos = [{nombre:"efectivo"},{nombre:"deposito"}];

  tiposSeries = [
    {nombre:"B003"},

  ];

  aux:string;

  msgs1: Message[];

  constructor(
    private primengConfig: PrimeNGConfig,
    public colegiadoService: ColegiadoService,
    private activatedRoute:ActivatedRoute,
    public facturaService:FacturaService,
    private router:Router,
    public tramiteService:TramiteService,
    private messageService: MessageService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    
    this.activatedRoute.paramMap.subscribe(params =>{
      let colegiadoId = +params.get('colegiadoId')!;
      this.colegiadoService.getColegiado(colegiadoId).subscribe(
        (colegiado) => {
          this.factura.colegiado = colegiado;
          let nuevoItem = new ItemFactura();
          
          let verificarFacturas:Factura[] = colegiado.facturas.filter(f =>{
            //SVDY 06012020 se agrega validación si factura esta extornada
            console.log(f);
            return f.tipo == 'cuota' && f.cancelado == false;
          });
          console.log(verificarFacturas);
          let v = this.validar01(colegiado.fechaColegiatura);

          colegiado.fechaColegiatura = v;

          this.fechaColegiaturaAbs = new Date(colegiado.fechaColegiatura);
          //console.log(this.fechaColegiaturaAbs)
          this.calcularDeuda(this.fechaColegiaturaAbs,verificarFacturas);
          

          this.tramiteService.getTramite(1).subscribe((tramite) => {
            nuevoItem.tramite = tramite;
            this.factura.items.push(nuevoItem);
          });
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
    console.log('actual: ',this.fechaActual);
    if(verificarFacturas.length ==0){
      this.fechaHastaDondePago.setDate(15);
      this.fechaHastaDondePago.setMonth(colegiaturaFecha.getMonth());
      this.fechaHastaDondePago.setFullYear(colegiaturaFecha.getFullYear());

      //Calcamos mese de deuda
      this.dateFrom.setMonth(this.fechaHastaDondePago.getMonth());
      this.dateFrom.setFullYear(this.fechaHastaDondePago.getFullYear());

      this.mesesDeuda = this.diferenciaMeses(this.dateFrom,this.dateTo);
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


  //Recalcular cantidad
  actualizarCantidad(id:number, event:any):void{
    let cantidad:number = event.target.value as number;

    if(cantidad==0){
      return this.eliminarItemFactura(id);
    }

    this.factura.items = this.factura.items.map((item:ItemFactura)=>{
      if(id === item.tramite.id){
        item.cantidad = cantidad;
      }
      return item;
    });
  }
  //verificar si existe ya el tramite
  existeItem(id:number):boolean{
    let existe = false;
    this.factura.items.forEach((item:ItemFactura)=>{
      if(id === item.tramite.id){
        existe = true;
      }
    });
    return existe;
  }
  //Incrementar cantidad a un producto
  incrementarCantidad(id:number):void{
    this.factura.items = this.factura.items.map((item:ItemFactura)=>{
      if(id === item.tramite.id){
        ++item.cantidad;
      }
      return item;
    });
  }
  //eliminar un item factura
  eliminarItemFactura(id:number):void{
    this.factura.items = this.factura.items.filter((item:ItemFactura)=>id !== item.tramite.id);
  }
  //Guardar factura
  create():void{
    //Validamos el nro de factura unica
    //let n;
    //reasignamos el codigo 
    //this.facturaService.validarFactura(this.factura.serie+"-c"+this.factura.numeroBoleta).subscribe(n=>{
      //if(n == 0 ){
    if(this.factura.serie && this.factura.formaPago){
      this.factura.tipo = "cuota";
      this.factura.cancelado = false;
      //tiposFilial = [{nombre:"CUSCO",valor:1},{nombre:"QUILLABAMBA",valor:2},{nombre:"ESPINAR",valor:3},{nombre:"SANTA MONICA",valor:4}];
      this.factura.filial = this.authService.usuario.filial; 
      this.factura.responsable = this.authService.usuario.nombre + ' ' + this.authService.usuario.apellido;
      if(!this.factura.resolucion){
        this.factura.descuento = 0;
      }

      let n = 0;
      n =  this.factura.items[0].cantidad;
      var a:any=[];
      for (let index = 0; index < n; index++) {
        a[index]=n;
      }

      this.factura.fechaHasta = this.fechaHastaDondePago.setMonth(this.fechaHastaDondePago.getMonth()+(a.length)).toString();
      //reasignamos el codigo de boleta
      //this.factura.numeroBoleta = this.factura.serie+"-c"+this.factura.numeroBoleta;
      this.facturaService.create(this.factura).subscribe(factura =>{
        
        Swal.fire('Nueva boleta creada',`Boleta de pago del colegiado ${factura.colegiado.nombre} ${factura.colegiado.apellido}, creada con éxito!`,'success');
        //this.router.navigate(['colegiados/detalle',factura.colegiado.id]);
        this.router.navigate(['boleta-de-pago',factura.id]);
      });
    }
    else{
      this.showError();
    }
        /*
      }
      else{
        this.showError();
        
      }*/
    //})
  }
  //Validacion
  showError() {
    if(!this.factura.serie){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'El número de serie es obligatorio, por favor complete.'});
    }
    /*
    if(!this.factura.numeroBoleta){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'El número de boleta es obligatorio, por favor complete.'});
    }*/
    if(!this.factura.formaPago){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'Por favor elija el metodo de pago.'});
    }
    /*
    else{
      this.messageService.add({severity:'warn', summary: 'Error: EN EL NÚMERO DE BOLETA', detail: 'El número de boleta ya existe en nuestra BASE DE DATOS, por favor verifique.'});
      
    }*/
  }
  //Animacion bar
  content:boolean=false;
  value: number = 95;
  mostrarBar()  
  {  
    this.content=true;
    let interval = setInterval(() => {
      this.value = this.value + Math.floor(Math.random() * 10) + 4;
      if (this.value >= 100) {
          this.value = 100;
          this.messageService.add({severity: 'success', summary: 'VALIDACIÓN CORRECTA', detail: 'Multas validadas correctamente :)'});
          clearInterval(interval);
          location.reload(); 
      }
  },500);
  }
  metodoPago(event: any): void {
    if(this.authService.usuario.filial == 1){
      if(this.factura.formaPago == "efectivo" ){
        this.factura.serie = "B003";
      }else{
        this.factura.serie = "B004";
      }
    }
    else{
      this.factura.serie= "B005";
    }
  }
}
