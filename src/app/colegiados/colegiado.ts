import { Habilidad } from './habilidad';
import { Universidad } from './universidad';
import { Factura } from '../facturas/models/factura';
export class Colegiado {
    id:number;
    colegiatura:string;
    apellido:string;
    nombre:string;
    dni:string;
    nacimiento:string;
    departamento:string;
    provincia:string;
    distrito:string;
    domicilio:string;
    trabajo:string;
    imagenId:string;

    universidad: Universidad;

    telefono:string;
    telefono2:string;
    correo:string;

    habilidad:Habilidad;

    fechaFallecimiento:string;
    lm:string;
    sexo:string;
    fechaColegiatura:string;
    actualizador:string;
    otros:string;

    facturas:Factura[]=[];
}