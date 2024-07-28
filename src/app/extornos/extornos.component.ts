import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { FacturaService } from '../facturas/services/factura.service';
import { AuthService } from '../usuarios/auth.service';
import { Factura } from '../facturas/models/factura';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Multa } from '../multas/multa';
import { MultaService } from '../multas/multa.service';

@Component({
  selector: 'app-extornos',
  templateUrl: './extornos.component.html',
  providers: [MessageService]
})
export class ExtornosComponent implements OnInit {

  factura = new Factura();
  term:string='';
  filialCole:string;
  multas:Multa[];

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
      this.facturaService.getFacturaPorBoleta(term).subscribe(factura =>{
        if(factura != null){
          if( factura.cancelado == false){
            if(factura.tipo != 'cuota'){
              this.factura = factura;
              this.factura.fechaPago= factura.fechaPago.substring(0,10)+' / '+factura.fechaPago.substring(11,19);
              Swal.fire('BOLETA ENCOTRADA',`La Boleta de número: ${factura.numeroBoleta}, fue encontrada.`,'success');
              switch (this.factura.filial.toString()) {
                case '1': this.filialCole = "CUSCO"
                  break;
                case '2': this.filialCole = "QUILLABAMBA"
                  break;
                case '3': this.filialCole = "ESPINAR"
                  break;
                case '4': this.filialCole = "SANTA MONICA"
                  break;
                default:
                  this.filialCole = "OTROS"
                  break;
              }
              
            }
            else{
              this.facturaService.validarExtornoCuota(factura.colegiado.id.toString()).subscribe(n=>{
                if(n !=null){
                  if(n==factura.id){
                    this.factura = factura;
                    this.factura.fechaPago= factura.fechaPago.substring(0,10)+' / '+factura.fechaPago.substring(11,19);
                    switch (this.factura.filial.toString()) {
                      case '1': this.filialCole = "CUSCO"
                        break;
                      case '2': this.filialCole = "QUILLABAMBA"
                        break;
                      case '3': this.filialCole = "ESPINAR"
                        break;
                      case '4': this.filialCole = "SANTA MONICA"
                        break;
                      default:
                        this.filialCole = "OTROS"
                        break;
                    }
                    Swal.fire('BOLETA ENCOTRADA',`La Boleta de número: ${factura.numeroBoleta}, fue encontrada.`,'success');
                  }
                  else{
                    Swal.fire('BOLETA NO SE PUEDE EXTORNAR',`La Boleta de número: ${factura.numeroBoleta} no se puede EXTORNAR debido a que ya existe un pago de cuota posterior a está.`,'warning');
                    this.factura = new Factura();
                  }
                }
                else{
                  this.factura = factura;
                  this.factura.fechaPago= factura.fechaPago.substring(0,10)+' / '+factura.fechaPago.substring(11,19);
                  switch (this.factura.filial.toString()) {
                    case '1': this.filialCole = "CUSCO"
                      break;
                    case '2': this.filialCole = "QUILLABAMBA"
                      break;
                    case '3': this.filialCole = "ESPINAR"
                      break;
                    case '4': this.filialCole = "SANTA MONICA"
                      break;
                    default:
                      this.filialCole = "OTROS"
                      break;
                  }
                  Swal.fire('BOLETA ENCOTRADA',`La Boleta con número de Folio: ${factura.id}, fue encontrada.`,'success');
                }
              }

              )
            }

          }
          else{
            Swal.fire('BOLETA EXTORNADA',`La Boleta de número: ${factura.numeroBoleta}, ya ha sido extornada.`,'info');
            this.factura = new Factura();
          }
        }
        else{
          Swal.fire('BOLETA NO EXISTE',`La Boleta de número: ${term}, no existe en nuestra Base de Datos.`,'warning');
          this.factura = new Factura();
        }
      })
    }
    else{
      Swal.fire('NÚMERO DE BOLETA INCORRECTO',`Ingrese un número de BOLETA correcto.`,'info');
      this.factura = new Factura();
    }
  }
  extornarBoleta(factura){
    this.factura = factura;
    Swal
    .fire({
        title: "RAZÓN DEL EXTORNO",
        input: "text",
        showCancelButton: true,
        confirmButtonText: "Extornar",
        cancelButtonText: "Cancelar",
        inputValidator: nombre => {
            // Si el valor es válido, debes regresar undefined. Si no, una cadena
            if (!nombre) {
                return "Por favor escribe la razón del EXTORNO";
            } else {
                return undefined;
            }
        }
    })
    .then(resultado => {
        if (resultado.value) {
            let nombre = resultado.value;
            this.factura.razon = nombre;
            this.factura.cancelado = true;
            //SVDY seteamos el nro de boleto a extornado
            //this.factura.numeroBoleta = this.factura.numeroBoleta + '-EXT-'+this.factura.id;
            //console.log(this.factura.numeroBoleta)
            this.factura.extornador=this.authService.usuario.nombre + ' ' + this.authService.usuario.apellido;
            this.factura.fechaPago = null;
            this.facturaService.extornar(this.factura).subscribe(factura =>{
              
              //SVDY 20022023
              //Obtenemos las multas del colegiado
              if(this.factura.tipo=='multa'){
                this.multaService.getMultasColegiado(this.factura.colegiado.colegiatura,1).subscribe((multas)=>
                {
                  this.multas=multas;
                  //Actualizar multas a pagadas del colegiado
                  this.multas.forEach(multa => {
                    this.factura.items.forEach(item =>{
                      if(item.tramite.id == Number (multa.tramiteid)){
                        multa.pagado = false;
                        this.multaService.updateMulta(multa).subscribe();
                      }
                    })
                  });
                });
              }
              Swal.fire('Boleta extornada',`Factura con número de Boleto: ${factura.numeroBoleta}, ha sido extornado con éxito!`,'success');
              this.router.navigate(['/colegiados/detalle',factura.colegiado.id]);
            });
        }
    });
  }
}
