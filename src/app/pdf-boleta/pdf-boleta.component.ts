import { Component, OnInit } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Factura } from '../facturas/models/factura';
import { FacturaService } from '../facturas/services/factura.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { CertificadoHabilidad } from '../facturas/models/certificado-habilidad';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-pdf-boleta',
  templateUrl: './pdf-boleta.component.html',
  styleUrls: ['./pdf-boleta.component.css'],
  providers: [MessageService]
})
export class PdfBoletaComponent implements OnInit {
  factura:Factura = new Factura();
  
  certificadoHabilidad:CertificadoHabilidad;
  constructor(
    public facturaService:FacturaService,
    private activatedRoute:ActivatedRoute,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
  ) { }

  

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.activatedRoute.paramMap.subscribe(params =>{
      let id = +params.get('id')!;
      this.facturaService.getFactura(id).subscribe(factura =>{
        this.factura = factura;
        if(factura.tipo=="cuota" && factura.filial==1){
          this.facturaService.getObtenerCertificadoHabilidad(this.factura.colegiado.colegiatura,false).subscribe(certificado => {
            this.certificadoHabilidad = certificado;
            console.log('Certificado habilidad: '+certificado.colegiadoId)
          })
        }
        if(factura.cancelado == false){
          this.factura.responsable='NORMAL'
        }
        else{this.factura.responsable='EXTORNADO - CANCELADO'}
        if(factura.colegiado.id == 0){
          let dni= this.factura.observacion;
          let nombre = this.factura.numeroTransaccion;
          this.factura.observacion = "BOLETA DE CLIENTE EXTERNO";
          this.factura.colegiado.dni=dni;
          this.factura.colegiado.nombre=nombre;
          this.factura.colegiado.apellido=" ";
        }
        else{this.factura.extornador='EXTORNADO - CANCELADO'}
        
      })
    })
  }

  

  async imprimirBoleta(n:number){
    const documentDefinition = { 
      //pageOrientation: 'landscape',
      pageMargins: [40, 20, 40, 20],
      content: 
      [
        {
          columns: [
            [
              {
                image: await this.getBase64ImageFromURL("/assets/logo-boleta.jpg"),
                width: 190,
                alignment: "center",
              },
              {
                text: " ",
                fontSize: 5,
              },
              {
                text: "Dirección : Calle Quiswar Lt. 18,19 y 20 Mz. E Urb. La Planicie ",
                fontSize: 8,
              },
              {
                text: "San Sebastian - Cusco.",
                fontSize: 8,
              },
              {
                text: "Teléfono : 084 276866 | 932 228460",
                fontSize: 8,
              },
              {
                text: "Estado Boleta : " + this.factura.responsable,
                fontSize: 8,
              },
            ],
            {
              table: {
                widths: ["*"], // Ocupa el espacio disponible
                body: [
                  [
                    {
                      text: "RUC : 20140278824",
                      fontSize: 12,
                      
                      
                      border: [true, true, true, false], // Borde superior y laterales
                      alignment: "center",
                      margin: [5, 5, 5, 5], // Espaciado interno
                    },
                  ],
                  [
                    {
                      text: "BOLETA DE VENTA",
                      fontSize: 20,
                      bold: true,
                      alignment: "center",
                      border: [true, false, true, false], // Borde inferior y laterales
                      margin: [0, 0, 0, 0], // Espaciado interno
                    },
                  ],
                  [
                    {
                      text: "ELECTRONICA",
                      fontSize: 20,
                      bold: true,
                      alignment: "center",
                      border: [true, false, true, false], // Borde inferior y laterales
                      margin: [0, 0, 0, 0], // Espaciado interno
                    },
                  ],
                  [
                    {
                      text:
                      this.factura.correlativo
                        ? "B003-" + this.factura.correlativo: this.factura.correlativo2
                        ? "B004-" + this.factura.correlativo2
                      : "-",
                      fontSize: 12,
                      border: [true, false, true, true], // Borde superior y laterales
                      alignment: "center",
                      margin: [5, 5, 5, 5], // Espaciado interno
                    },
                  ],
                ],
              },
              layout: {
                hLineWidth: function (i, node) {
                  return 1; // Grosor de línea horizontal
                },
                vLineWidth: function (i, node) {
                  return 1; // Grosor de línea vertical
                },
                hLineColor: function (i, node) {
                  return "black"; // Color de línea horizontal
                },
                vLineColor: function (i, node) {
                  return "black"; // Color de línea vertical
                },
              },
            },
          ],
        },        
        {canvas: [{ type: 'line', x1: 0, y1: 3, x2: 595-2*40, y2: 3, lineWidth: 1.5 }]},

        {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 3,color: 'white', }]},
        {
          text: "Fecha y hora de emisión: "+this.factura.fechaPago.substring(0,10)+' / '+this.factura.fechaPago.substring(11,19),
          fontSize: 8,
        },
        {
          text: "Colegiatura                       : "+this.factura.colegiado.colegiatura,
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
        {
          text: this.factura.rapifacEstado ? "RAPIFAC                            : "+"ACEPTADA" : "TRAMITE                          : Pago Interno",
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
            table: {
              widths: ["75%", "25%"], // Define el ancho de las columnas
              body: [
                [
                  {
                    table: {
                      widths: ["100%"],
                      body: [
                        [
                          {
                            text: "OBSERVACIONES:",
                            fontSize: 11,
                            bold: true,
                            border: [false, false, false, false], 
                            alignment: "left",
                          },
                        ],
                        [
                          {
                            text: this.factura.observacion ? this.factura.observacion : "-",
                            fontSize: 10,
                            border: [false, false, false, false], 
                          },
                        ],
                        [
                          {
                            text: "",
                            fontSize: 10,
                            border: [false, false, false, false], 
                          },
                        ],
                        [
                          {
                            text: "",
                            fontSize: 10,
                            border: [false, false, false, false], 
                          },
                        ],
                        [
                          {
                            text: "",
                            fontSize: 10,
                            border: [false, false, false, false], 
                          },
                        ],
                        [
                          {
                            text: "Emitido a través de RAPIFAC Proveedor Autorizado por SUNAT, descarga el documento en WWW.RAPIFAC.COM - Autorizado mediante Resolución de Intendencia N° 094-005-0001933/SUNAT",
                            fontSize: 8,
                            bold: true,
                            border: [false, false, false, false], 
                          },
                        ],
                      ],
                    },
                    border: [true, true, true, true], // Borde negro para toda la tabla
                  },
                  {
                    table: {
                      widths: ["100%"],
                      body: [
                        [
                          {
                            qr:
                              "https://icac-habilidad.web.app/colegiado/consulta-habilidad/" +
                              this.factura.colegiado.colegiatura,
                            fit: 70,
                            alignment: "center",
                            border: [false, false, false, false], // Sin bordes internos
                            margin: [5, 5, 5, 5],
                          },
                        ],
                        [
                          {
                            text: "Escanee el código QR para verificar su HABILIDAD EN LINEA",
                            fontSize: 6,
                            alignment: "center",
                            border: [false, false, false, false], // Sin bordes internos
                            margin: [5, 2, 5, 2], // Espaciado interno
                          },
                        ],
                      ],
                    },
                  },
                ],
              ],
            },
            layout: {
              hLineWidth: function (i, node) {
                return 1; // Grosor del borde horizontal
              },
              vLineWidth: function (i, node) {
                return 1; // Grosor del borde vertical
              },
              hLineColor: function (i, node) {
                return "black"; // Color del borde horizontal
              },
              vLineColor: function (i, node) {
                return "black"; // Color del borde vertical
              },
            },
          },
          
        /*
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
                text: "Emitido a través de RAPIFAC Proveedor Autorizado por SUNAT, descarga el documento en WWW.RAPIFAC.COM - Autorizado mediante Resolución de Intendencia N° 094-005-0001933/SUNAT",
                bold: true,
                fontSize: 6,
                //alignment: 'center'
              },
            ]
          ]
        },*/
      ],
      info: {
        title:  "BOLETA-" + this.factura.numeroBoleta,
        
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

  

  //Imprimir certificado habilidad
async imprimirCertificado(n: number) {
  const documentDefinition = {
    pageSize: 'A4',
    pageMargins: [0, 0, 0, 0], // Sin márgenes para que la imagen ocupe todo el fondo
    background: [
      {
        image: await this.getBase64ImageFromURLHabilidad("/assets/certificado-habilidad.jpg"),
        width: 595, // Ancho de A4 en puntos (portrait)
        height: 842, // Alto de A4 en puntos (portrait)
        absolutePosition: { x: 0, y: 0 } // Posiciona la imagen en toda la página
      }
    ],
    content: [

      {
        text: " ",
        style: 'header',
        absolutePosition: { x: 200, y: 50 }, // Ajusta la posición del texto sobre la imagen
      },
      {
        text: this.factura.colegiado.nombre + ' '+this.factura.colegiado.apellido,
        style: 'name',
        absolutePosition: { x: 210, y: 366 },
      },
      {
        text: this.factura.colegiado.colegiatura,
        style: 'name',
        absolutePosition: { x: 210, y: 423.5 },
      },
      {
        text: this.formatearFecha(this.factura.colegiado.fechaColegiatura),
        style: 'name',
        absolutePosition: { x: 300, y: 452 },
      },
      {
        text: this.formatearFechaUltimoDia(this.factura.fechaHasta),
        
        style: 'name',
        absolutePosition: { x: 265, y: 511 },
      },
      {
        text:  this.formatearFecha(this.certificadoHabilidad.fechaEmision) + '.', 
        style: 'name',
        absolutePosition: { x: 350, y: 650 },
      },
      {
        //certificado +this.certificadoHabilidad.id
        text: "D-000"+this.certificadoHabilidad.id, 
        style: 'certificateNumber',
        absolutePosition: { x: 390, y: 740 },
      }
      
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
        color: 'black'
      },
      name: {
        fontSize: 16,
        bold: true,
        color: 'black'
      },
      text: {
        fontSize: 14,
        color: 'black'
      },
      certificateNumber: {
        fontSize: 20,
        bold: true,
        color: 'red'
      }
    }
  };

  if (n == 1) {
    pdfMake.createPdf(documentDefinition).print();
  } else {
    pdfMake.createPdf(documentDefinition).download();
  }
}

getBase64ImageFromURLHabilidad(url) {
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

  openRapifac(repositorio:string) {
    //window.open('https://wscomprobante-exp.rapifac.com/v0/comprobantes/pdf?key=IIKGJf7+cdow+hPJudVW3Q==', '_blank');
    let urlPDF = 'https://wscomprobante.rapifac.com/v0/comprobantes/pdf?key='+repositorio
    window.open(urlPDF, '_blank');
  }
  goRapifac() {
    const pdfUrl = 'assets/certificado.pdf'; // Ruta relativa
    window.open(pdfUrl, '_blank'); // Abre el PDF en una nueva pestaña
  }
  formatearFecha(fechaISO: string): string {
    const fecha = new Date(fechaISO);
    
    // Opciones de formato en español
    const opciones: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    
    // Formatear la fecha en español
    return fecha.toLocaleDateString('es-ES', opciones);
  }

  formatearFechaMesAnio(fechaISO: string): string {
    const fecha = new Date(fechaISO);
    
    // Opciones de formato para obtener solo el mes en mayúsculas y el año
    const opcionesMes: Intl.DateTimeFormatOptions = { month: 'long' };
    const mes = fecha.toLocaleDateString('es-ES', opcionesMes).toUpperCase();
    
    const anio = fecha.getFullYear(); // Obtener el año
  
    return `${mes} - ${anio}`;
  }
  formatearFechaUltimoDia(fechaISO: string): string {
    const fecha = new Date(fechaISO);
    
    // Obtener el último día del mes
    const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate();
    
    // Opciones de formato para obtener el mes en español
    const opcionesMes: Intl.DateTimeFormatOptions = { month: 'long' };
    const mes = fecha.toLocaleDateString('es-ES', opcionesMes).toLowerCase();
  
    const anio = fecha.getFullYear(); // Obtener el año
  
    return `${ultimoDia} de ${mes} del ${anio}`;
  }
}
