import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { FacturaService } from '../../facturas/services/factura.service';
import { Factura } from '../../facturas/models/factura';
import * as FileSaver from 'file-saver';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-reporte-cobros',
  templateUrl: './reporte-cobros.component.html',
  styleUrls: ['./reporte-cobros.component.css'],
  providers: [MessageService]
})
export class ReporteCobrosComponent implements OnInit {
  hoy = new Date();
  term = new Date();
  consulta = new Date();
  t:string = '';
  
  totalCuotas: number = 0;
  totalTramites: number = 0;
  totalMultas: number = 0;
  totalCursos: number = 0;
  importeTotal: number =0;

  facturas:Factura[]=[];
  selectedProducts: Factura[];
  first = 0;
  rows = 10;

  //Tabla exportadora

  cols: any[];
  exportColumns: any[];
  grande:any[]=[];

  constructor(
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    public facturaService:FacturaService
  ) { }

  ngOnInit(): void {
  }
  obtenerFacturaDia(term:Date){

    this.consulta = term;


    let dia = term.getDate().toString();
    if(Number(dia)<10){
      dia='0'+dia;
    }
    let mes = (term.getMonth() + 1).toString();
    if(Number(mes)<10){
      mes='0'+mes;
    }
    let año = term.getFullYear()
    this.t = año + "-"+ mes + "-" + dia;
    let e=0;
    this.facturaService.listarFacturaPorDia(this.t, e.toString()).subscribe((facturas)=>{
      console.log(facturas)
      
      if(facturas.length>0){
        //Limpiar
        this.limpiar();

        this.facturas=facturas;
        //let nro=1
        this.facturas.map((factura)=>{
          if(factura.cancelado == false){
            let filiales='';
            factura.fechaPago= factura.fechaPago.substring(0,10)+' / '+factura.fechaPago.substring(11,19);
            //factura.id=nro++;
            factura.serie = factura.colegiado.nombre + ' ' + factura.colegiado.apellido;
            factura.resolucion = factura.colegiado.colegiatura;
            this.importeTotal = this.importeTotal + factura.total;
            if(factura.tipo == 'cuota'){
              this.totalCuotas = this.totalCuotas + factura.total;
            }
            if(factura.tipo == 'multa'){
              this.totalMultas = this.totalMultas + factura.total;
            }
            if(factura.tipo == 'tramite'){
              this.totalTramites = this.totalTramites + factura.total;
            }
            if(factura.tipo == 'curso'){
              this.totalCursos = this.totalCursos + factura.total;
            }
            factura.observacion = ''
            factura.items.forEach((i)=>{
              factura.observacion =factura.observacion +i.tramite.descripcion+'; '
            });
            //console.log(factura.filial)
            switch(factura.filial.toString()) {
              case '1': {
                filiales = 'CUSCO'
                break;
              }
              case '2': {
                filiales = 'QUILLABAMBA'
                break;
              }
              case '3': {
                filiales = 'ESPINAR'
                break;
              }
              case '4': {
                filiales = 'SANTA MONICA'
                break;
              }
              
            }
            this.grande.push([factura.id,factura.numeroBoleta,factura.numeroTransaccion,factura.fechaPago,factura.tipo,factura.observacion,factura.resolucion,factura.serie,factura.responsable,filiales,factura.descuento,factura.total]);
          }
        })

        this.cols = [
          { field: 'id', header: 'Folio', customExportHeader: 'Fecha' },
          { field: 'numeroBoleta', header: 'Boleta' },
          { field: 'numeroTransaccion', header: 'Nro. Rapifac' },
          { field: 'fechaPago', header: 'Fecha y Hora' },
          { field: 'tipo', header: 'Producto' },
          { field: 'observacion', header: 'Concepto' },
          { field: 'resolucion', header: 'Colegiatura' },
          { field: 'serie', header: 'Cliente' },
          { field: 'responsable', header: 'Cajero(a)' },
          { field: 'filial', header: 'Filial' },
          { field: 'descuento', header: 'Descuento' },
          { field: 'total', header: 'Importe' }
        ];
      }
      else{
        //toast
        this.messageService.clear();
        this.messageService.add({key: 'c', sticky: true, severity:'warn', summary:'NO EXISTE', detail:'No existen boletas con esa fecha, por favor verifique!!'});
        //Limpiar
        this.limpiar();
      }
    })
  }

  exportPdf() {
    import("jspdf").then(jsPDF => {
        import("jspdf-autotable").then(x => {
            const doc = new jsPDF.default();
            autoTable(doc, {
              head: [['Nro', 'Boleta','Nro. Rapifac','Fecha y Hora', 'Producto','Concepto','Colegiatura','Cliente','Cajero(a)','Filial','Descuento','Importe']],
              body: this.grande
          });
            doc.save(`Reporte-de-facturas-dia-${this.t}.pdf`);
        })
    })
}

  exportExcel() {
    import("xlsx").then(xlsx => {
        let excelDatos=[];
        excelDatos=this.grande;
        excelDatos.unshift(['Nro', 'Boleta','Nro. Rapifac','Fecha y Hora', 'Producto','Concepto','Colegiatura','Cliente','Cajero(a)','Filial','Descuento','Importe']);
        const worksheet = xlsx.utils.json_to_sheet(this.grande,{skipHeader: true});
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, `Reporte-de-facturas-dia-${this.t}`);
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
  limpiar(){
    this.facturas=[];
    this.facturas=[];
    this.cols=[];
    this.grande=[];
    this.totalCuotas = 0;
    this.totalTramites = 0;
    this.totalMultas = 0;
    this.importeTotal = 0;
  }
  next() {
    this.first = this.first + this.rows;
  }

  prev() {
      this.first = this.first - this.rows;
  }

  reset() {
      this.first = 0;
  }

  isLastPage(): boolean {
      return this.facturas ? this.first === (this.facturas.length - this.rows): true;
  }

  isFirstPage(): boolean {
      return this.facturas ? this.first === 0 : true;
  }
  showConfirm() {
    this.messageService.clear();
    this.messageService.add({key: 'c', sticky: true, severity:'warn', summary:'Are you sure?', detail:'Confirm to proceed'});
  }
  onConfirm() {
    this.messageService.clear('c');
  }

  onReject() {
      this.messageService.clear('c');
  }
}
