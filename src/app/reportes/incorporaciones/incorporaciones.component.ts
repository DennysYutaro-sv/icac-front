import { Component, OnInit } from '@angular/core';
import { Colegiado } from 'src/app/colegiados/colegiado';
import { ColegiadoService } from '../../colegiados/colegiado.service';
import { PrimeNGConfig, MessageService } from 'primeng/api';
import * as FileSaver from 'file-saver';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-incorporaciones',
  templateUrl: './incorporaciones.component.html',
  styleUrls: ['./incorporaciones.component.css'],
  providers: [MessageService]
})
export class IncorporacionesComponent implements OnInit {

  colegiadosA:Colegiado[]=[];
  selectedProducts: Colegiado[];
  first = 0;
  rows = 5;
  actFecha = new Date();
  //Tabla exportadora
  
  cols: any[];
  exportColumns: any[];
  grande:any[]=[];

  constructor(
    public colegiadoService:ColegiadoService,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.colegiadoService.getColegiadosEsteAnio().subscribe((colegiados)=>{
      this.colegiadosA = colegiados;
      this.colegiadosA = this.colegiadosA.reverse();
      this.colegiadosA.map((colegiado)=>{
        colegiado.fechaColegiatura= colegiado.fechaColegiatura.substring(0,10);
        this.grande.push([colegiado.colegiatura,colegiado.nombre,colegiado.apellido,colegiado.provincia,colegiado.distrito,colegiado.fechaColegiatura]);
      })

      this.cols = [
        { field: 'colegiatura', header: 'Colegiatura', customExportHeader: 'Fecha' },
        { field: 'nombre', header: 'Nombre' },
        { field: 'apellido', header: 'Apellido' },
        { field: 'provincia', header: 'Provincia' },
        { field: 'distrito', header: 'Distrito' },
        { field: 'fechaColegiatura', header: 'Fecha de colegiatura' }
      ];
    })
  }

  exportPdf() {
    import("jspdf").then(jsPDF => {
        import("jspdf-autotable").then(x => {
            const doc = new jsPDF.default();
            autoTable(doc, {
              head: [['Colegiatura', 'Nombre','Apellido', 'Provincia','Distrito','Fecha de colegiatura']],
              body: this.grande
          });
            doc.save(`Reporte-de-colegiados-incorporados-en-este-año.pdf`);
        })
    })
}

  exportExcel() {
    import("xlsx").then(xlsx => {
        let excelDatos=[];
        excelDatos=this.grande;
        excelDatos.unshift(['Colegiatura', 'Nombre','Apellido', 'Provincia','Distrito','Fecha de colegiatura']);
        const worksheet = xlsx.utils.json_to_sheet(this.grande,{skipHeader: true});
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, `Reporte-de-colegiados-incorporados-en-este-año`);
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
      return this.colegiadosA ? this.first === (this.colegiadosA.length - this.rows): true;
  }

  isFirstPage(): boolean {
      return this.colegiadosA ? this.first === 0 : true;
  }

}
