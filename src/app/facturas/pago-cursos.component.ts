import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { Observable } from 'rxjs';
import { flatMap, map,startWith } from 'rxjs/operators';
import { Tramite } from './models/tramite';
import { Factura } from './models/factura';
import { ColegiadoService } from '../colegiados/colegiado.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FacturaService } from './services/factura.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ItemFactura } from './models/item-factura';
import Swal from 'sweetalert2';
import {MessageService} from 'primeng/api';
import { AuthService } from '../usuarios/auth.service';
import { HabilidadService } from '../habilidades/habilidad.service';

@Component({
  selector: 'app-pago-cursos',
  templateUrl: './pago-cursos.component.html',
  providers: [MessageService]
})
export class PagoCursosComponent implements OnInit {
  autocompleteControl = new FormControl();
  tramitesFiltrados: Observable<Tramite[]>;
  tramite:Tramite;

  factura:Factura = new Factura();

  tiposPagos = [{nombre:"efectivo"},{nombre:"deposito"}];
  tiposSeries = [
    {nombre:"B001"},
    {nombre:"B002"},
    {nombre:"B003"},
    {nombre:"E001"},
    {nombre:"E002"},
    {nombre:"F001"},
    {nombre:"F002"},
    {nombre:"F003"},
    {nombre:"S001"},
    {nombre:"S002"},
    {nombre:"Q001"},
    {nombre:"Q002"}
  ];
  
  dniConsulta:string='';
  constructor(
    private primengConfig: PrimeNGConfig,
    public colegiadoService: ColegiadoService,
    private activatedRoute:ActivatedRoute,
    public facturaService:FacturaService,
    private router:Router,
    private messageService: MessageService,
    public authService : AuthService,
    public habilidadService : HabilidadService,
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.activatedRoute.paramMap.subscribe(params =>{
      let colegiadoId = +params.get('colegiadoId')!;
      console.log(+params.get('colegiadoId'))
      this.colegiadoService.getColegiado(colegiadoId).subscribe(colegiado => this.factura.colegiado = colegiado);
      

      //cargar filtro
      this.tramitesFiltrados = this.autocompleteControl.valueChanges.pipe(
        map(value => typeof value === "string"? value:value.nombre),
        flatMap(value => value ? this._filter(value):[])
      );

    });
    console.log(this.factura)
  }

  //Consulta Reniec
  consultarReniec(dni:string){
    console.log("DNI",dni)
    if(dni.length == 8){
      this.habilidadService.getDni(dni).subscribe(
        (r) =>{
          if(r.message){
            Swal.fire({
              title: 'RENIEC: DNI no encontrado',
              text: 'DNI no encontrado, por favor verifique.',
              imageUrl: '/assets/reniec.png',
              imageWidth: 350,
              imageHeight: 150,
              imageAlt: 'reniec',
            })
            this.dniConsulta = '';
            this.factura.numeroTransaccion = '';
            this.factura.observacion= '';
          }
          else {
            this.dniConsulta = '';
            this.factura.numeroTransaccion = r.nombres +' '+ r.apellidoPaterno+' '+r.apellidoMaterno;
            this.factura.observacion= r.dni;
            Swal.fire({
              title: 'RENIEC: DNI encontrado',
              text: 'Persona: '+r.nombres +' '+ r.apellidoPaterno+' '+r.apellidoMaterno+' - '+r.dni,
              imageUrl: '/assets/reniec.png',
              imageWidth: 350,
              imageHeight: 150,
              imageAlt: 'reniec',
              confirmButtonText: "Aceptar",
            });
          }
        }
      )
    }
    else{
      Swal.fire('DNI incorrecto','Verifique el número de DNI','warning');
      this.dniConsulta = '';
      this.factura.numeroTransaccion = '';
      this.factura.observacion= '';
    } 
  }
  //Buscar mediante el boton enter
  onKeyUp(dni) { // appending the updated value to the variable
    //this.consultarReniec = dni.target.value
    this.consultarReniec(dni);
  }
  //material
  private _filter(value: string): Observable<Tramite[]>{
    const filterValue = value.toLowerCase();
    return this.facturaService.filtrarCursos(filterValue);
  }
  //mostrar nombre del autocomplete
  mostrarNombre(tramite:Tramite):string{
    return tramite.nombre;
  }
  //seleccionado por autocomplete
  seleccionarTramite(event:MatAutocompleteSelectedEvent):void{
    let tramite = event.option.value as Tramite;
    //console.log(tramite);
    
    //evitar agregar 2 veces
    if(this.existeItem(tramite.id)){
      this.incrementarCantidad(tramite.id);
    }
    //creamos linea item
    else{
      let nuevoItem = new ItemFactura();
      nuevoItem.tramite = tramite;
      this.factura.items.push(nuevoItem);
    }
    //autocomplete limpiar
    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
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
    
    //this.facturaService.validarFactura(this.factura.serie + "-co" +this.factura.numeroBoleta).subscribe(n=>{
    //this.facturaService.validarFactura(this.factura.numeroBoleta).subscribe(n=>{
    //  if(n == 0){
    if(this.factura.serie && this.factura.formaPago){
      this.factura.tipo = "curso";
      this.factura.cancelado = false;
      //tiposFilial = [{nombre:"CUSCO",valor:1},{nombre:"QUILLABAMBA",valor:2},{nombre:"ESPINAR",valor:3},{nombre:"SANTA MONICA",valor:4}];
      this.factura.filial = this.authService.usuario.filial;       
      this.factura.responsable = this.authService.usuario.nombre + ' ' + this.authService.usuario.apellido;
      //reasignamos el codigo de boleta
      //this.factura.numeroBoleta = this.factura.serie + "-co" + this.factura.numeroBoleta;
      this.facturaService.create(this.factura).subscribe(factura =>{
        Swal.fire('Nueva boleta creada',`Boleta de pago del colegiado ${factura.colegiado.nombre} ${factura.colegiado.apellido}, creada con éxito!`,'success');
        //this.router.navigate(['colegiados/detalle',factura.colegiado.id]);
        this.router.navigate(['boleta-de-pago',factura.id]);
      });
    }
    else{
      this.showError();
    }
      //}
    //  else this.showError();
    //})
  }
  //Validacion
  showError() {
    if(!this.factura.serie){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'El número de serie es obligatorio, por favor complete.'});
    }
    if(!this.factura.formaPago){
      this.messageService.add({severity:'warn', summary: 'Error: Complete datos', detail: 'Por favor elija el metodo de pago.'});
    }
    /*
    else{
      this.messageService.add({severity:'warn', summary: 'Error: EN EL NÚMERO DE BOLETA', detail: 'El número de boleta ya existe en nuestra BASE DE DATOS, por favor verifique.'});
    }
    */
  }

}
