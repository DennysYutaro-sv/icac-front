import { Colegiado } from '../../colegiados/colegiado';
import { ItemFactura } from './item-factura';

export class Factura {
    id: number;
    serie: string;
    numeroBoleta: string;
    numeroTransaccion: string;

    colegiado: Colegiado;

    formaPago:string;
    fechaPago:string;
    resolucion:string;
    observacion:string;
    responsable:string;
    filial:Number;
    cancelado:boolean;
    razon:string;
    extornador:string;

    tipo:string;
    
    fechaHasta: string;

    items:ItemFactura[]=[];

    descuento:number=0;
    
    total:number;

    calcularGranTotal():number{
        this.total = 0;
        this.items.forEach((item:ItemFactura)=>{
            this.total+=item.calcularImporte();
        });
        this.total=this.total-this.descuento
        return this.total;
    }
    //Parametros para RAPIFAC
    correlativo:number;
    rapifacEstado:string;
    repositorio:string;
}