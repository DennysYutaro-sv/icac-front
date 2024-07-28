import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Colegiado } from 'src/app/colegiados/colegiado';
import { Factura } from 'src/app/facturas/models/factura';
import { ColegiadoService } from '../../colegiados/colegiado.service';
import { saveAs } from 'file-saver';
import * as FileSaver from 'file-saver';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-historial-pagos',
  templateUrl: './historial-pagos.component.html',
  styleUrls: ['./historial-pagos.component.css'],
  providers: [MessageService]
})
export class HistorialPagosComponent implements OnInit {

  term:string="";
  coleagiado:Colegiado = new(Colegiado);
  facturas:Factura[]=[];

  selectedProducts: Factura[];
  

  //Tabla exportadora
  
  cols: any[];
  exportColumns: any[];

  grande:any[]=[];
  

  constructor(
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    public colegiadoService: ColegiadoService,
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    
  }

  buscarColegiadoByColegiatura(){
    if(this.term.length==0){

      //toast
      this.messageService.clear();
      this.messageService.add({key: 'c', sticky: true, severity:'warn', summary:'ERROR', detail:'Tiene que ingresar el número de colegiatura a buscar, por favor verifique!!'});

      this.term="";
      //this.coleagiado=[];
    }
    else{
      this.colegiadoService.getColegiadoByCole(this.term).subscribe(
        (response)=>{
          if(!response){

            //toast
            this.messageService.clear();
            this.messageService.add({key: 'c', sticky: true, severity:'warn', summary:'NO EXISTE', detail:'El número de colegiatura ingresado no existe en nuestra base de datos, por favor verifique!!'});
            //Limpiar
            this.limpiar();
          }
          else{
            //Limpiar
            this.limpiar();
            
            this.coleagiado=response;
            let nombre = this.coleagiado.nombre+' '+this.coleagiado.apellido;
            this.facturas = response.facturas;
            this.facturas.map((factura)=>{
              factura.fechaPago= factura.fechaPago.substring(0,10);
              factura.responsable = nombre;
            })
            //Tabla para importar
            this.cols = [
              { field: 'fechaPago', header: 'Fecha', customExportHeader: 'Fecha' },
              { field: 'responsable', header: 'Colegiado' },
              { field: 'formaPago', header: 'Forma de pago' },
              { field: 'numeroBoleta', header: 'Nro. Boleta' },
              { field: 'tipo', header: 'Producto' },
              { field: 'total', header: 'Importe' }
            ];
            this.facturas.map((factura) =>{
              let item=[];
              item.push(factura.fechaPago);
              item.push(factura.responsable);
              item.push(factura.formaPago);
              item.push(factura.numeroBoleta);
              item.push(factura.tipo);
              item.push(factura.total);
              this.grande.push(item);
            } 
            
            )
            }
        }
      )
    }
  }

  exportPdf() {
    import("jspdf").then(jsPDF => {
        import("jspdf-autotable").then(x => {
            const doc = new jsPDF.default();
            autoTable(doc, {
              head: [['Fecha', 'Colegiado','Forma de pago', 'Nro. Boleta','Producto','Importe']],
              body: this.grande
          });
            doc.save(`Historial-de-pagos-${this.coleagiado.apellido}-${this.coleagiado.colegiatura}.pdf`);
        })
    })
}

  exportExcel() {
    import("xlsx").then(xlsx => {
        let excelDatos=this.grande;
        excelDatos.unshift(['Fecha', 'Colegiado','Forma de pago', 'Nro. Boleta','Producto','Importe']);
        const worksheet = xlsx.utils.json_to_sheet(this.grande,{skipHeader: true});
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, `Historial-de-pagos-${this.coleagiado.apellido}-${this.coleagiado.colegiatura}`);
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
    this.term="";
    this.coleagiado=new Colegiado();
    this.facturas=[];
    this.cols=[];
    this.grande=[];
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
