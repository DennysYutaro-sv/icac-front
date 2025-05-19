import { Component, OnInit } from '@angular/core';
import { Factura } from '../facturas/models/factura';
import { Multa } from '../multas/multa';
import { Router } from '@angular/router';
import { FacturaService } from '../facturas/services/factura.service';
import { AuthService } from '../usuarios/auth.service';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { MultaService } from '../multas/multa.service';
import Swal from 'sweetalert2';
import { CertificadoExterno } from './certificado-externo';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-certificado',
  templateUrl: './certificado.component.html',
  styleUrls: ['./certificado.component.css'],
  providers: [MessageService]
})
export class CertificadoComponent implements OnInit {

    factura = new Factura();
    term:string='';
    filialCole:string;
    multas:Multa[];
    certificado:CertificadoExterno=new CertificadoExterno();

  constructor(
        private router:Router,
        public facturaService: FacturaService,
        public authService:AuthService,
        private primengConfig: PrimeNGConfig,
        private messageService: MessageService,
        public multaService: MultaService,
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }
  buscarFactura(term:string){
      if(term!=''){
        term = term.trim();
        this.facturaService.getObtenerCertificadoInterno(term).subscribe(certificado =>{
          if(certificado.codigo == '00'){
            this.certificado = certificado;
          }
          else{
            Swal.fire('NO SE PUEDE OBTENER CERTIFICADO',`El colegiado: ${term} no cumple con los requisitos, recuerda que tiene que pagar 12 meses para poder obtener su CERTIFICADO DIGITAL ICAC.`,'warning');
            this.factura = new Factura();
            this.certificado = new CertificadoExterno();
          }
        })
      }
      else{
        Swal.fire('NÚMERO DE COLEGIATURA INCORRECTO',`Ingrese un número de COLEGIATURA correcto.`,'info');
        this.factura = new Factura();
        this.certificado = new CertificadoExterno();
      }
    }
    

    formatearFecha(fechaISO: string): string {
      const fecha = new Date(fechaISO);
      
      // Opciones de formato en español
      const opciones: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
      
      // Formatear la fecha en español
      return fecha.toLocaleDateString('es-ES', opciones);
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
  //Imprimir certificado habilidad
  async imprimirCertificado() {
    const documentDefinition = {
      pageSize: 'A4',
      pageMargins: [0, 0, 0, 0], // Sin márgenes para que la imagen ocupe todo el fondo
      background: 
      [
        /*{
          image: await this.getBase64ImageFromURLHabilidad("/assets/certificado-habilidad.jpg"),
          width: 595, // Ancho de A4 en puntos (portrait)
          height: 842, // Alto de A4 en puntos (portrait)
          absolutePosition: { x: 0, y: 0 } // Posiciona la imagen en toda la página
        }*/
      ],
      content: [

        {
          text: " ",
          style: 'header',
          absolutePosition: { x: 200, y: 50 }, // Ajusta la posición del texto sobre la imagen
        },
        {
          text: this.certificado.nombres,
          style: 'name',
          absolutePosition: { x: 210, y: 366 },
        },
        {
          text: this.certificado.colegiatura,
          style: 'name',
          absolutePosition: { x: 210, y: 423.5 },
        },
        {
          text: this.formatearFecha(this.certificado.fechaColegiatura),
          style: 'name',
          absolutePosition: { x: 300, y: 452 },
        },
        {
          text: this.formatearFechaUltimoDia(this.certificado.fechaHasta),
          
          style: 'name',
          absolutePosition: { x: 265, y: 511 },
        },
        {
          text:  this.formatearFecha((new Date()).toString()) + '.', 
          style: 'name',
          absolutePosition: { x: 350, y: 650 },
        },
        {
          //certificado +this.certificadoHabilidad.id
          text: "D-000"+this.certificado.codigoDigital, 
          style: 'certificateNumber',
          absolutePosition: { x: 390, y: 740 },
        }
        
      ],
      info: {
        title: "CERTIFICADO-" + this.certificado.codigoDigital,
        author: "YAWAR TECH SAC",
        subject: 'CERTIFICADO',
        keywords: 'CERTIFICADO, YAWAR TECH',
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

    //if (n == 1) {
      pdfMake.createPdf(documentDefinition).print();
    //} else {
    //  pdfMake.createPdf(documentDefinition).download();
    //}
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
}
