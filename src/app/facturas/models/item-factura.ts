import { Tramite } from "./tramite";

export class ItemFactura{
    cantidad: number=1;
    tramite:Tramite;
    importe: number;
    valor:number;

    public calcularImporte():number{
        return this.cantidad*this.tramite.precio;
    }
}