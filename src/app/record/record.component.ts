import { Component, OnInit } from '@angular/core';
import { Colegiado } from '../colegiados/colegiado';
import { Factura } from '../facturas/models/factura';
import { PrimeNGConfig } from 'primeng/api';
import { ColegiadoService } from '../colegiados/colegiado.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MultaService } from '../multas/multa.service';
import { Multa } from '../multas/multa';
import { TramiteService } from '../tramites/services/tramite.service';
import { ItemFactura } from '../facturas/models/item-factura';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit {

  public colegiado:Colegiado = new Colegiado();

  public facturas:Factura[] = [];
  factura:Factura = new Factura();
  multas:Multa[];
  deuda:number;

  fechaHastaDondePago= new Date();
  fechaColegiaturaAbs= new Date();
  fechaActual = new Date();
  mesesDeuda:number = 0;

  dateFrom = new Date();
  dateTo = new Date();

  subtotal:number = 0;
  descuento:number = 0;
  total:string = '0';

  currentDate: string = new Date().toISOString();

  constructor(
    private primengConfig: PrimeNGConfig,
    public colegiadoService : ColegiadoService,
    private router:Router,
    public activatedRouter: ActivatedRoute,
    public MultaService: MultaService,
    public tramiteService: TramiteService,
  ) { }

  ngOnInit(): void {
    this.cargarColegiado();
    this.primengConfig.ripple = true;
  }

  cargarColegiado():void{
    this.activatedRouter.params.subscribe(
      params => {
        let id = params['id'];
        if(id){
          this.colegiadoService.getColegiado(id).subscribe(
            (colegiado) => {
              this.colegiado = colegiado;
              this.colegiado.nombre = colegiado.nombre + " " + colegiado.apellido
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
              
              if(this.mesesDeuda>0){
                this.tramiteService.getTramite(1).subscribe((tramite) => {
                  nuevoItem.tramite = tramite;
                  this.subtotal = this.subtotal + (tramite.precio * this.mesesDeuda);
                  this.factura.items.push(nuevoItem);
                });
              }
              
              this.MultaService.getMultasColegiado(this.colegiado.colegiatura,0).subscribe((multas)=>
                {
                  this.multas=multas;
                  console.log(this.multas.length)
                  if(this.multas.length>0){
                    this.multas.forEach(multa => {
                      this.tramiteService.getTramite(Number(multa.tramiteid)).subscribe((tramite) => 
                        {
                          let nuevoItem = new ItemFactura();
                          nuevoItem.tramite = tramite;
                          //nuevoItem.tramite.precio = nuevoItem.tramite.precio - nuevoItem.tramite.precio*0.6;
                          nuevoItem.tramite.descripcion = nuevoItem.tramite.descripcion + " / " + "CON DESCUENTO DE 60%"
                          this.subtotal = this.subtotal + nuevoItem.tramite.precio;
                          this.descuento = this.descuento + nuevoItem.tramite.precio*0.6
                          this.factura.items.push(nuevoItem);
                          
                        });
                    });
                  }
                  
                });
                /*
                let verificarFacturas:Factura[] = colegiado.facturas.filter(f =>{
                  return f.tipo == 'cuota' && f.cancelado == false;
                });

                let v = this.validar01(colegiado.fechaColegiatura);

                colegiado.fechaColegiatura = v;

                this.fechaColegiaturaAbs = new Date(colegiado.fechaColegiatura);

                this.calcularDeuda(this.fechaColegiaturaAbs,verificarFacturas);

                let nuevoItem = new ItemFactura();
                this.tramiteService.getTramite(1).subscribe((tramite) => {
                  nuevoItem.tramite = tramite;
                  this.subtotal = this.subtotal + (tramite.precio * this.mesesDeuda);
                  this.factura.items.push(nuevoItem);
                });
                */

            }
          )
        }
      }
    );
  }
  calcularTotal():string{
    let total = this.subtotal - this.descuento;
    return total.toFixed(2)
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

  getFormattedDate(): string {
    const date = new Date(this.currentDate);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true // Este ajuste muestra AM/PM
    };
    return date.toLocaleString('es-ES', options);
  }

  getFormattedDate1(date: Date): string {
    const month = date.toLocaleString('es-ES', { month: 'long' });
    const year = date.getFullYear();
    return `${month} - ${year}`;
  }

  async imprimirBoleta(n:number){
    const documentDefinition = { 
      //pageOrientation: 'landscape',
      content: 
      [
        {
          columns: [
            [{
              text: "Ilustre Colegio de Abogados del Cusco - Record de Deudas",
              bold: true,
              fontSize: 16,
              alignment: 'center'
            },
            {
              text: "Dirección : Calle Quiswar Lt. 18,19 y 20 Mz. E Urb.   La Planicie ",
              fontSize: 8,
            },
            {
              text: "San Sebastian - Cusco.",
              fontSize: 8,
            },
            {
              text: 'RUC : 20140278824',
              fontSize: 8,
            },
            {
              text: 'Telefono : 084 276866 | 932 228460',
              fontSize: 8,
            },
            ],
            [
              {
                image: await this.getBase64ImageFromURL(
                  "/assets/logo-boleta.jpg"
                ),
                width: 240,
                alignment : 'right'
              }
            ]
          ]
        },
        {canvas: [{ type: 'line', x1: 0, y1: 3, x2: 595-2*40, y2: 3, lineWidth: 1.5 }]},

        {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 3,color: 'white', }]},

        {
          columns: [
            [
            {
              text: "Fecha y hora de emisión :"  + this.getFormattedDate(),
              fontSize: 8,
            },
            {
              text: "Colegiado                          :" + this.colegiado.nombre,
              fontSize: 8,
            },
            {
              text: 'DNI                                     : '+this.colegiado.dni,
              fontSize: 8,
            },
            ],
            [
              
            ]
          ]
        },
        {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 3,color: 'white', }]},
        
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              [{text: 'DESCRIPCION',fillColor: '#599864',fontSize: 12,color: 'white',alignment: 'center',bold: true,}, 
              {text: 'PRECIO UNITARIO',fillColor: '#599864',fontSize: 12,color: 'white',alignment: 'center',bold: true,}, 
              {text: 'CANTIDAD',fillColor: '#599864',fontSize: 12,color: 'white',alignment: 'center',bold: true,}, 
              {text: 'TOTAL',fillColor: '#599864',fontSize: 12,color: 'white',alignment: 'center',bold: true,}, 
              ],
              ...this.factura.items.map(i => ([i.tramite.id == 1 ? `CUOTA MENSUAL DEL AGREMIADO (EL COLEGIADO PAGO HASTA: ${this.getFormattedDate1(this.fechaHastaDondePago)})` : i.tramite.nombre,"S/ "+i.tramite.precio,i.tramite.id==1?this.mesesDeuda:i.cantidad,i.tramite.id==1?(i.tramite.precio*this.mesesDeuda).toFixed(2):"S/ "+(i.tramite.precio*i.cantidad).toFixed(2)])),
              //[{text: 'Sub Total', colSpan: 3}, {}, {},"S/ "+  this.factura.items.reduce((sum, i)=> sum + (i.cantidad* i.tramite.precio), 0).toFixed(2)],
              [{text: 'Sub Total', colSpan: 3}, {}, {},"S/ "+  this.subtotal.toFixed(2)],
              [{text: 'Descuento del 60% de MULTAS por promoción válida hasta el 31 de diciembre del 2024', colSpan: 3}, {}, {},"S/ -"+ this.descuento.toFixed(2)],
              [{text: 'TOTAL A PAGAR', colSpan: 3}, {}, {},"S/ "+this.calcularTotal()]
            ]
          }
        },
        {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 3,color: 'white', }]},
        {
          columns: [
            
            [
              {
                table: {
                  widths: ['100%'],
                  heights: [10,5],
                  body: [
                      [
                          { 
                              text: 'OBSERVACIONES:',
                              fontSize: 9,
                              bold: true,
                              border: [true, true, true, false],
                          }
                      ],
                      [
                          { 
                              text: `EL COLEGIADO PAGO HASTA: ${this.getFormattedDate1(this.fechaHastaDondePago)}.`,
                              fontSize: 6,
                              bold: true,
                              border: [true, false, true, true],
                          }
                      ],
                  ],
                },
              },
            ],
            [
              {
                columns : [
                  { qr: "COLEGIO-ABOGADOS-CUSCO-"+this.factura.numeroBoleta, fit : 50 ,alignment: 'center',},
                ]
              }
            ],
            [
              {
                table: {
                  widths: ['100%'],
                  heights: [30,5,5],
                  body: [
                      [
                          { 
                              text: ' ',
                              fontSize: 10,
                              bold: true,
                              border: [false, false, false, false],
                          }
                      ],
                      [
                          { 
                              text: "FIRMA CLIENTE",
                              fontSize: 6,
                              bold: true,
                              border: [false, true, false, false],
                              alignment: 'center',
                          }
                      ],
                      [
                        { 
                            text: "DNI CLIENTE: ",
                            fontSize: 6,
                            bold: true,
                            border: [false, false, false, false],
                            alignment: 'left',
                        }
                    ],
                  ],
                },
              },
            ]
          ]
        },
        {canvas: [{ type: 'line', x1: 0, y1: 2.5, x2: 595-2*40, y2: 2.5, lineWidth: 3,color: 'white', }]},
        {canvas: [{ type: 'line', x1: 0, y1: 3, x2: 595-2*40, y2: 3, lineWidth: 1.5 }]},
        {canvas: [{ type: 'line', x1: 0, y1: 2.5, x2: 595-2*40, y2: 2.5, lineWidth: 3,color: 'white', }]},
        {
          columns: [
            
            [
              {
                text: "Atención: Está es una representación gráfica de un pedido ordenado en el aplicativo Colegio de Abogados Cusco. Para más información visite el siguiente enlace: yawartech.com ",
                fontSize: 6,
              },
            ],
            [
              {
                text: "!Muchas Gracias!",
                bold: true,
                fontSize: 15,
                alignment: 'center'
              },
            ]
          ]
        },
      ],
      info: {
        title: "RECORD-DEUDA-" + this.colegiado.colegiatura+"-"+this.colegiado.nombre,
        author: "YAWAR TECH SAC",
        subject: 'BOLETA',
        keywords: 'BOLETA, YAWAR TECH',
      },
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 20, 0, 10],
            decoration: 'underline'
          },
          name: {
            fontSize: 16,
            bold: true
          },
          jobTitle: {
            fontSize: 14,
            bold: true,
            italics: true
          },
          sign: {
            margin: [0, 50, 0, 10],
            alignment: 'right',
            italics: true
          },
          tableHeader: {
            bold: true,
          }
        }
    };
    if(n==1){
      pdfMake.createPdf(documentDefinition).print();
    }
    else{
      pdfMake.createPdf(documentDefinition).download();
    }
  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }


}
