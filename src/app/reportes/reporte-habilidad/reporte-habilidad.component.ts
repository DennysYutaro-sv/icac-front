import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { Colegiado } from '../../colegiados/colegiado';
import { ColegiadoService } from '../../colegiados/colegiado.service';
import * as FileSaver from 'file-saver';
import autoTable from 'jspdf-autotable';
import { Factura } from '../../facturas/models/factura';

@Component({
  selector: 'app-reporte-habilidad',
  templateUrl: './reporte-habilidad.component.html',
  styleUrls: ['./reporte-habilidad.component.css'],
  providers: [MessageService]
})
export class ReporteHabilidadComponent implements OnInit {

  items: MenuItem[];
  colegiados=[];
  activado:boolean=false;
  //fecha actual
  fechaActual = new Date();
  mesesDeuda:number = 0;
  contador:number = 1;
  colegiado:Colegiado=new Colegiado();

  public isDisabled:boolean = false;

  colegiadosFiltratos=[];
  pagoHasta:string = '';

  grande:any[]=[];

  first = 0;

  rows = 10;

  //Tabla exportadora
  cols: any[];
  exportColumns: any[];
  selectedProducts: Colegiado[];

  constructor(
    private primengConfig: PrimeNGConfig,
    public colegiadoService:ColegiadoService
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.items = [
      {
        label: 'Colegiados Habilitados-Activos',
        icon: 'pi pi-credit-card',
        command: ()=>{this.buscarHabilitadoActivo()}
      },
      {
          label: 'Colegiados Habilitados',
          icon: 'pi pi-credit-card',
          command: ()=>{this.buscarHabilitados()}
      },
      {
        label: 'Colegiados Vitalicios',
        icon: 'pi pi-users',
        command: ()=>{this.buscarVitalicios()}
      },
      {
          label: 'Colegiados Honorarios',
          icon: 'pi pi-sort-alpha-down',
          command: ()=>{this.buscarHonorarios()}
      },
      {
          label: 'Colegiados Suspendidos',
          icon: 'pi pi-sort-numeric-down',
          command: ()=>{this.buscarSuspendidos()}
      },
      {
          label: 'Colegiados en Fraccionamiento',
          icon: 'pi pi-sort-numeric-down',
          command: ()=>{this.buscarFraccionamiento()}
      },
      {
          label: 'Obituario',
          icon: 'pi pi-sort-numeric-down',
          command: ()=>{this.buscarObituario()}
      }
    ];
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
  //Calcular meses entre 2 fechas
  diferenciaMeses(dateFrom:Date, dateTo:Date) { 

    return dateTo.getMonth() - dateFrom.getMonth() + (12 * (dateTo.getFullYear() - dateFrom.getFullYear())) 
  }

  buscarHabilitados(){
    this.grande=[];
    this.pagoHasta ='';
    if(!this.activado)
    this.colegiadoService.obtenerReporteHabilidad(1).subscribe(
      (response)=>{
        this.colegiadosFiltratos=response;
        console.log(this.colegiadosFiltratos)
        this.colegiadosFiltratos.map((colegiado)=>{
          colegiado.push('HABILITADO')
          colegiado.push(this.contador)
          this.colegiados.push(this.colegiado);
          this.contador++;
          this.grande.push([colegiado[5],colegiado[1],colegiado[2],colegiado[0],colegiado[4]]);
        })
        this.cols = [
          { field: 5, header: 'Nro' },
          { field: 1, header: 'Nombre' , customExportHeader: 'nombre'},
          { field: 2, header: 'Apellido' },
          { field: 0, header: 'Colegiatura' },
          { field: 4, header: 'Estado' },
        ];
      }
    )
    this.isDisabled = true;
  }

  buscarVitalicios(){
    this.grande=[];
    this.pagoHasta ='';
    if(!this.activado)
    this.colegiadoService.obtenerReporteHabilidad(4).subscribe(
      (response)=>{
        this.colegiadosFiltratos=response;
        console.log(this.colegiadosFiltratos)
        this.colegiadosFiltratos.map((colegiado)=>{
          colegiado.push('VITALICIO')
          colegiado.push(this.contador)
          this.colegiados.push(this.colegiado);
          this.contador++;
          this.grande.push([colegiado[5],colegiado[1],colegiado[2],colegiado[0],colegiado[4]]);
        })
        this.cols = [
          { field: 5, header: 'Nro' },
          { field: 1, header: 'Nombre' , customExportHeader: 'nombre'},
          { field: 2, header: 'Apellido' },
          { field: 0, header: 'Colegiatura' },
          { field: 4, header: 'Estado' },
        ];
      }
    )
    this.isDisabled = true;
  }
  buscarHonorarios(){
    this.grande=[];
    this.pagoHasta ='';
    if(!this.activado)
    this.colegiadoService.obtenerReporteHabilidad(2).subscribe(
      (response)=>{
        this.colegiadosFiltratos=response;
        console.log(this.colegiadosFiltratos)
        this.colegiadosFiltratos.map((colegiado)=>{
          colegiado.push('MIEMBRO HONORARIO')
          colegiado.push(this.contador)
          this.colegiados.push(this.colegiado);
          this.contador++;
          this.grande.push([colegiado[5],colegiado[1],colegiado[2],colegiado[0],colegiado[4]]);
        })
        this.cols = [
          { field: 5, header: 'Nro' },
          { field: 1, header: 'Nombre' , customExportHeader: 'nombre'},
          { field: 2, header: 'Apellido' },
          { field: 0, header: 'Colegiatura' },
          { field: 4, header: 'Estado' },
        ];
      }
    )
    this.isDisabled = true;
  }
  buscarSuspendidos(){
    this.grande=[];
    this.pagoHasta ='';
    if(!this.activado)
    this.colegiadoService.obtenerReporteHabilidad(5).subscribe(
      (response)=>{
        this.colegiadosFiltratos=response;
        console.log(this.colegiadosFiltratos)
        this.colegiadosFiltratos.map((colegiado)=>{
          colegiado.push('SUSPENDIDO')
          colegiado.push(this.contador)
          this.colegiados.push(this.colegiado);
          this.contador++;
          this.grande.push([colegiado[5],colegiado[1],colegiado[2],colegiado[0],colegiado[4]]);
        })
        this.cols = [
          { field: 5, header: 'Nro' },
          { field: 1, header: 'Nombre' , customExportHeader: 'nombre'},
          { field: 2, header: 'Apellido' },
          { field: 0, header: 'Colegiatura' },
          { field: 4, header: 'Estado' },
        ];
      }
    )
    this.isDisabled = true;
  }
  buscarObituario(){
    this.grande=[];
    this.pagoHasta ='';
    if(!this.activado)
    this.colegiadoService.obtenerReporteHabilidad(3).subscribe(
      (response)=>{
        this.colegiadosFiltratos=response;
        console.log(this.colegiadosFiltratos)
        this.colegiadosFiltratos.map((colegiado)=>{
          colegiado.push('FALLECIDO')
          colegiado.push(this.contador)
          this.colegiados.push(this.colegiado);
          this.contador++;
          this.grande.push([colegiado[5],colegiado[1],colegiado[2],colegiado[0],colegiado[4]]);
        })
        this.cols = [
          { field: 5, header: 'Nro' },
          { field: 1, header: 'Nombre' , customExportHeader: 'nombre'},
          { field: 2, header: 'Apellido' },
          { field: 0, header: 'Colegiatura' },
          { field: 4, header: 'Estado' },
        ];
      }
    )
    this.isDisabled = true;
  }

  buscarFraccionamiento(){
    this.grande=[];
    this.pagoHasta ='';
    if(!this.activado)
    this.colegiadoService.obtenerReporteHabilidad(7).subscribe(
      (response)=>{
        this.colegiadosFiltratos=response;
        console.log(this.colegiadosFiltratos)
        this.colegiadosFiltratos.map((colegiado)=>{
          colegiado.push('ACTIVO CON FRACCIONAMIENTO')
          colegiado.push(this.contador)
          this.colegiados.push(this.colegiado);
          this.contador++;
          this.grande.push([colegiado[5],colegiado[1],colegiado[2],colegiado[0],colegiado[4]]);
        })
        this.cols = [
          { field: 5, header: 'Nro' },
          { field: 1, header: 'Nombre' , customExportHeader: 'nombre'},
          { field: 2, header: 'Apellido' },
          { field: 0, header: 'Colegiatura' },
          { field: 4, header: 'Estado' },
        ];
      }
    )
    this.isDisabled = true;
  }
  buscarHabilitadoActivo(){
    this.grande=[];
    this.pagoHasta ='';
    if(!this.activado)
    this.colegiadoService.obtenerReporteHabilidadActivo().subscribe(
      (response)=>{
        this.colegiadosFiltratos=response;
        this.colegiadosFiltratos.map((colegiado)=>{
          colegiado.push(this.contador)
          this.colegiados.push(this.colegiado);
          this.contador++;
          this.grande.push([colegiado[4],colegiado[0],colegiado[1],colegiado[2],colegiado[3]]);
        })
        this.cols = [
          { field: 4, header: 'Nro' },
          { field: 0, header: 'Nombre' , customExportHeader: 'nombre'},
          { field: 1, header: 'Apellido' },
          { field: 2, header: 'Colegiatura' },
          { field: 3, header: 'Estado' },
        ];
      }
    )
    this.isDisabled = true;
  }

  exportPdf() {
    import("jspdf").then(jsPDF => {
        import("jspdf-autotable").then(x => {
            const doc = new jsPDF.default();
            autoTable(doc, {
              head: [['Nro','Nombre', 'Apellido','Colegiatura','Estado']],
              body: this.grande
          });
            doc.save(`Reporte-colegiados-por-habilidad.pdf`);
        })
    })
}

  exportExcel() {
    import("xlsx").then(xlsx => {
        let excelDatos=this.grande;
        excelDatos.unshift(['Nro','Nombre', 'Apellido','Colegiatura','Estado']);
        const worksheet = xlsx.utils.json_to_sheet(excelDatos,{skipHeader: true});
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, `Reporte-colegiados-por-habilidad`);
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
  cargar(){
    location.reload()
  }
}
