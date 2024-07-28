import { Component, OnInit } from '@angular/core';
import { Factura } from '../facturas/models/factura';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { FacturaService } from '../facturas/services/factura.service';
import Swal from 'sweetalert2';
import pdfMake from 'pdfmake/build/pdfmake';

@Component({
  selector: 'app-buscar-factura',
  templateUrl: './buscar-factura.component.html',
  styleUrls: ['./buscar-factura.component.css'],
  providers: [MessageService]
})
export class BuscarFacturaComponent implements OnInit {

  factura = new Factura();
  term:string='';
  filialCole:string;

  constructor(
    public facturaService: FacturaService,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }
  buscarFactura(term:string){
    if(term!=''){
      term = term.trim();
      this.facturaService.getFacturaPorBoleta(term).subscribe(factura =>{
        if(factura != null){
          this.factura = factura;
          this.factura.fechaPago= factura.fechaPago.substring(0,10)+' / '+factura.fechaPago.substring(11,19);
          Swal.fire('BOLETA ENCOTRADA',`La Boleta de número: ${factura.numeroBoleta}, fue encontrada.`,'success');
          switch (this.factura.filial.toString()) {
            case '1': this.filialCole = "CUSCO"
              break;
            case '2': this.filialCole = "QUILLABAMBA"
              break;
            case '3': this.filialCole = "ESPINAR"
              break;
            case '4': this.filialCole = "SANTA MONICA"
              break;
            default:
              this.filialCole = "OTROS"
              break;
          }
        }
        else{
          Swal.fire('BOLETA NO EXISTE',`La Boleta de número: ${term}, no existe en nuestra Base de Datos.`,'warning');
          this.factura = new Factura();
        }
      })
    }
    else{
      Swal.fire('NÚMERO DE BOLETA INCORRECTO',`Ingrese un número de BOLETA correcto.`,'info');
      this.factura = new Factura();
    }
  }
  async imprimirBoleta(n:number){
    if(this.factura.cancelado == false){
      this.factura.responsable='NORMAL'
    }
    else{this.factura.responsable='EXTORNADO - CANCELADO'}
    if(this.factura.colegiado.id == 0){
      let dni= this.factura.observacion;
      let nombre = this.factura.numeroTransaccion;
      this.factura.observacion = "BOLETA DE CLIENTE EXTERNO";
      this.factura.colegiado.dni=dni;
      this.factura.colegiado.nombre=nombre;
      this.factura.colegiado.apellido=" ";
    }
    else{this.factura.extornador='EXTORNADO - CANCELADO'}
    const documentDefinition = { 
      //pageOrientation: 'landscape',
      content: 
      [
        {
          columns: [
            [{
              text: "Ilustre Colegio de Abogados del Cusco",
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
            {
              text: 'Estado Boleta : '+this.factura.responsable,
              fontSize: 8,
            },
            {
              text: 'Nro. Boleta: '+this.factura.numeroBoleta,
              fontSize: 8,
            }
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
          text: "Fecha y hora de emisión: "+this.factura.fechaPago,
          fontSize: 8,
        },
        {
          text: "Cliente                               : "+this.factura.colegiado.nombre+" "+this.factura.colegiado.apellido,
          fontSize: 8,
        },
        {
          text: "DNI                                     : "+this.factura.colegiado.dni,
          fontSize: 8,
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
              ...this.factura.items.map(i => ([i.tramite.id==1?"CUOTA MENSUAL DEL AGREMIADO":i.tramite.nombre,"S/ "+i.tramite.precio, i.cantidad, "S/ "+(i.tramite.precio*i.cantidad).toFixed(2)])),
              [{text: 'Sub Total', colSpan: 3}, {}, {},"S/ "+  this.factura.items.reduce((sum, i)=> sum + (i.cantidad* i.tramite.precio), 0).toFixed(2)],
              [{text: 'Descuento', colSpan: 3}, {}, {},"S/ -"+ this.factura.descuento.toFixed(2)],
              [{text: 'TOTAL A PAGAR', colSpan: 3}, {}, {},"S/ "+this.factura.total.toFixed(2)]
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
                              text: this.factura.observacion,
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
        title: "BOLETA-" + this.factura.numeroBoleta,
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
