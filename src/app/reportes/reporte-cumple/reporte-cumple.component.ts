import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ColegiadoService } from 'src/app/colegiados/colegiado.service';
import * as FileSaver from 'file-saver';
import autoTable from 'jspdf-autotable';
import { Colegiado } from 'src/app/colegiados/colegiado';

@Component({
  selector: 'app-reporte-cumple',
  templateUrl: './reporte-cumple.component.html',
  providers: [MessageService]
})
export class ReporteCumpleComponent implements OnInit {
  hoy = new Date();
  term = new Date();
  consulta = new Date();
  t:string = '';
  colegiados:any[]=[];
  selectedProducts: Colegiado[];
  first = 0;
  rows = 10;
  colegiadosFiltratos=[];
  contador:number = 1;
  colegiado:Colegiado=new Colegiado();

  //Tabla exportadora
  cols: any[];
  exportColumns: any[];
  grande:any[]=[];

  constructor(
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    public colegiadoService:ColegiadoService
  ) { }

  ngOnInit(): void {
  }
  obtenerFacturaDia(term:Date){
    //Limpiar
    this.limpiar();
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
    this.colegiadoService.getCumplesPorFecha(this.t).subscribe(
      
      (response)=>{
        if(response.length>0){

          this.colegiadosFiltratos=response;
          this.colegiadosFiltratos.map((colegiado)=>{
            colegiado.push(this.contador)
            switch(colegiado[3].toString()) {
              case '1': {
                colegiado[3] = 'HABILITADO'
                break;
              }
              case '2': {
                colegiado[3] = 'MIEMBRO HONORARIO'
                break;
              }
              case '3': {
                colegiado[3] = 'FALLECIDO'
                break;
              }
              case '4': {
                colegiado[3] = 'VITALICIO'
                break;
              }
              case '5': {
                colegiado[3] = 'SUSPENDIDO'
                break;
              }
              case '6': {
                colegiado[3] = 'EXTERNO'
                break;
              }
              case '7': {
                colegiado[3] = 'ACTIVO CON FRACCIONAMIENTO'
                break;
              }
            }
          
            this.colegiados.push(this.colegiado);
            this.contador++;
            this.grande.push([colegiado[5],colegiado[0],colegiado[1],colegiado[2],colegiado[3],colegiado[4]]);
        })
        this.cols = [
          { field: 5, header: 'Nro' },
          { field: 0, header: 'Colegiatura' , customExportHeader: 'colegiatura'},
          { field: 1, header: 'Nombre' },
          { field: 2, header: 'Apellido' },
          { field: 3, header: 'Habilidad' },
          { field: 4, header: 'Nacimiento' },
        ];
        }
        else{
          //toast
          this.messageService.clear();
          this.messageService.add({key: 'c', sticky: true, severity:'warn', summary:'NO EXISTE', detail:'No existen colegiados con esa fecha de nacimiento, por favor verifique!!'});
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
            head: [['Nro','Colegiatura', 'Nombre','Apellido','Habilidad','Nacimiento']],
            body: this.grande
        });
          doc.save(`Reporte-cumpleanios-colegiados.pdf`);
      })
  })
}

  exportExcel() {
    import("xlsx").then(xlsx => {
        let excelDatos=[];
        excelDatos=this.grande;
        excelDatos.unshift(['Nro','Colegiatura', 'Nombre','Apellido','Habilidad','Nacimiento']);
        const worksheet = xlsx.utils.json_to_sheet(this.grande,{skipHeader: true});
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, `Reporte-cumpleanios-colegiados-${this.t}`);
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
    this.colegiados=[];
    this.colegiados=[];
    this.cols=[];
    this.grande=[];
    this.contador = 1;
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
      return this.colegiados ? this.first === (this.colegiados.length - this.rows): true;
  }

  isFirstPage(): boolean {
      return this.colegiados ? this.first === 0 : true;
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
