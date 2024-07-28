import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Factura } from '../../facturas/models/factura';
import { ActivatedRoute, Router } from '@angular/router';
import { ColegiadoService } from '../../colegiados/colegiado.service';
import { MultaService } from '../multa.service';
import { ItemFactura } from 'src/app/facturas/models/item-factura';
import { Multa } from '../multa';
import { TramiteService } from '../../tramites/services/tramite.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import Swal from 'sweetalert2';
import { FacturaService } from '../../facturas/services/factura.service';

@Component({
  selector: 'app-multa-pago',
  templateUrl: './multa-pago.component.html',
  styleUrls: ['./multa-pago.component.css'],
  providers: [MessageService]
})
export class MultaPagoComponent implements OnInit {

  factura:Factura = new Factura();

  tiposPagos = [{nombre:"efectivo"},{nombre:"deposito"}];
  tiposSeries = [
    {nombre:"B001"},
    {nombre:"B002"},
    {nombre:"B003"},
    {nombre:"F001"},
    {nombre:"F002"},
    {nombre:"F003"},
    {nombre:"S001"},
    {nombre:"S002"},
    {nombre:"Q001"},
    {nombre:"Q002"}
  ];

  //-- Para control de multas de un colegiado --
  multas:Multa[];
  public errores: string[];

  constructor(
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private activatedRoute:ActivatedRoute,
    public colegiadoService: ColegiadoService,
    public multaService: MultaService,
    public tramiteService: TramiteService,
    public authService: AuthService,
    public facturaService:FacturaService,
    private router:Router,
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.activatedRoute.paramMap.subscribe(params =>{
      let colegiadoId = +params.get('id')!;
      this.colegiadoService.getColegiado(colegiadoId).subscribe(
        (colegiado) => {
          this.factura.colegiado = colegiado;
          //Obtenemos las multas del colegiado
          this.multaService.getMultasColegiado(this.factura.colegiado.colegiatura,0).subscribe((multas)=>
          {
            this.multas=multas;
            console.log(this.multas);
            this.multas.forEach(multa => {
              this.tramiteService.getTramite(Number(multa.tramiteid)).subscribe((tramite) => 
                {
                  let nuevoItem = new ItemFactura();
                  nuevoItem.tramite = tramite;
                  this.factura.items.push(nuevoItem);
                });
            });
          });
          
        });
    })
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
  //eliminar un item factura
  eliminarItemFactura(id:number):void{
    this.factura.items = this.factura.items.filter((item:ItemFactura)=>id !== item.tramite.id);
  }

  //Guardar factura
  create():void{
    //Validamos el nro de factura unica
    let n;
    //reasignamos el codigo 
    //this.facturaService.validarFactura( this.factura.serie+"-m"+this.factura.numeroBoleta).subscribe(n=>{
      //if(n == 0){
    if(this.factura.serie && this.factura.formaPago){
      this.factura.tipo = "multa";
      this.factura.cancelado = false;
      //tiposFilial = [{nombre:"CUSCO",valor:1},{nombre:"QUILLABAMBA",valor:2},{nombre:"ESPINAR",valor:3},{nombre:"SANTA MONICA",valor:4}];
      this.factura.filial = this.authService.usuario.filial;          
      this.factura.responsable = this.authService.usuario.nombre + ' ' + this.authService.usuario.apellido;
      //reasignamos el codigo de boleta
      //this.factura.numeroBoleta= this.factura.serie+"-m"+this.factura.numeroBoleta;
      this.facturaService.create(this.factura).subscribe(factura =>{
        //Actualizar multas a pagadas del colegiado
        this.multas.forEach(multa => {
          this.factura.items.forEach(item =>{
            if(item.tramite.id == Number (multa.tramiteid)){
              multa.pagado = true;
              this.multaService.updateMulta(multa).subscribe();
            }
          })
        });
        Swal.fire('Nueva boleta creada',`Boleta de pago del colegiado ${factura.colegiado.nombre} ${factura.colegiado.apellido}, creada con éxito!`,'success');
        //this.router.navigate(['colegiados/detalle',factura.colegiado.id]);
        this.router.navigate(['boleta-de-pago',factura.id]);
      })
    }
    else{
      this.showError();
    }
      /*}
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
    /*else{
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
}
