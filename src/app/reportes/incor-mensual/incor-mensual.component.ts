import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ColegiadoService } from '../../colegiados/colegiado.service';
import { Colegiado } from 'src/app/colegiados/colegiado';

@Component({
  selector: 'app-incor-mensual',
  templateUrl: './incor-mensual.component.html',
  styleUrls: ['./incor-mensual.component.css'],
  providers: [MessageService]
})
export class IncorMensualComponent implements OnInit {

  colegiadosA:Colegiado[]=[];

  basicData: any;

  basicOptions: any;
  actFecha = new Date();
  

  constructor(
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    public colegiadoService:ColegiadoService,
  ) { }

  ngOnInit(): void {
    
    this.colegiadoService.getColegiadosEsteAnio().subscribe((colegiados)=>{
      this.colegiadosA = colegiados;
      this.colegiadosA = this.colegiadosA.reverse();

      let ene = 0;let feb = 0;let mar = 0;let abr = 0;let may = 0;let jun = 0;
      let jul = 0;let ago = 0;let set = 0;let oct = 0;let nov = 0;let dic = 0;
      console.log('antes',dic);
      this.colegiadosA.map((colegiado)=>{
        colegiado.fechaColegiatura= colegiado.fechaColegiatura.substring(0,10);
        //obtenenmos mes
        let mes = colegiado.fechaColegiatura.substring(5,7);
        
        switch(mes){
          case mes='01': ene = ene+1;break;
          case mes='02': feb = ++feb;break;
          case mes='03': mar = ++mar;break;
          case mes='04': abr = ++abr;break;
          case mes='05': may = ++may;break;
          case mes='06': jun = ++jun;break;
          case mes='07': jul = ++jul;break;
          case mes='08': ago = ++ago;break;
          case mes='09': set = ++set;break;
          case mes='10': oct = ++oct;break;
          case mes='11': nov = ++nov;break;
          case mes='12': dic = ++dic;break;
          default:
            console.log('default');
        }
        
      })

      this.basicData = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre'],
        datasets: [
            {
                label: 'Cantidad de incorporaciones',
                backgroundColor: [
                  '#EC407A',
                  '#AB47BC',
                  '#42A5F5',
                  '#7E57C2',
                  '#66BB6A',
                  '#FFCA28',
                  '#26A69A'],
                data: [ene, feb, mar, abr, may, jun, jul,ago,set,oct,nov,dic]
            },
        ]
    };
    })
    
  }

}
