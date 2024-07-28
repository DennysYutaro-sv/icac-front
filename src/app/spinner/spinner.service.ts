import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor(
    public spinnerService: NgxSpinnerService
  ) { }

  //Metodo para mostrar spinner
  public llamarSpinner(){
    this.spinnerService.show();
  }

  //Metodo para detener spinner
  public detenerSpinner(){
    this.spinnerService.hide();
  }

}
