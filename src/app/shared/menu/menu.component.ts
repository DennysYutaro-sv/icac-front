import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { AuthService } from '../../usuarios/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ColegiadoService } from '../../colegiados/colegiado.service';
import { Colegiado } from '../../colegiados/colegiado';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: [
  ]
})
export class MenuComponent implements OnInit {


  items: MenuItem[]=[];
  colegiados:Colegiado[]=[];

  date = new Date();
  position: string;
  displayPosition: boolean;

  filial:string = '';

  constructor(
    public authService:AuthService,
    private router:Router,
    public colegiadoService:ColegiadoService,
    private primengConfig: PrimeNGConfig
    ) { }

  logout():void{
    Swal.fire('Éxito en cerrar sesión',`Hasta luego ${this.authService.usuario.nombre} ${this.authService.usuario.apellido}, has cerrado sesión con éxito!`,'success');
    this.authService.logout();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.obtenerFilial();
    this.items=[
      {
          label:'Colegiados',
          icon:'pi pi-fw pi-users',
          routerLink: '/colegiados',
          visible: this.authService.hasRole('ROLE_USER')
      },
    {
      label:'Operaciones',
      icon:'pi pi-fw pi-cog',
      //routerLink: '/universidades',
      visible: this.authService.hasRole('ROLE_USER'),
      items:[
        {
          label:'Cuota',
          icon:'pi pi-fw pi-money-bill',
          command: ()=> this.rutear(),
          visible: this.authService.hasRole('ROLE_USER')
        },
        {
          label:'Tramites',
          icon:'pi pi-fw pi-file',
          routerLink: '/tramites',
          visible: this.authService.hasRole('ROLE_USER')
        },
        {
          label:'Multas',
          icon:'pi pi-fw pi-wallet',
          routerLink: '/multas',
          visible: this.authService.hasRole('ROLE_USER')
        },
        {
          label:'Cursos / Diplomados',
          icon:'pi pi-fw pi-id-card',
          routerLink: '/cursos',
          visible: this.authService.hasRole('ROLE_USER')
        },
        {
          label:'Buscar Boleta',
          icon:'pi pi-fw pi-file',
          routerLink: '/buscar-boleta',
          visible: this.authService.hasRole('ROLE_USER')
        },
        {
          label:'Extornar Boleta',
          icon:'pi pi-fw pi-file-excel',
          routerLink: '/extornos',
          visible: this.authService.hasRole('ROLE_USER')
        },
      ]
    },
    {
      label:'Mesa de partes',
      icon:'pi pi-fw pi pi-fw pi-book',
      visible: this.authService.hasRole('ROLE_USER'),
      items:[
        {
          label:'Universidades',
          icon:'pi pi-fw pi-building',
          routerLink: '/universidades',
          visible: this.authService.hasRole('ROLE_USER')
      },
      /*
      {
        label:'Mesa de partes virtual',
        icon:'pi pi-lock',
        command : ()=> this.mejora1(),
        //routerLink: '/universidades',
        visible: this.authService.hasRole('ROLE_USER')
      },*/
        {
            label:'Crear Colegiado',
            icon:'pi pi-fw pi-user-plus',
            routerLink: '/colegiados/form',
            visible: this.authService.hasRole('ROLE_ADMIN'),
        },
        {
          label:'Certificación de Habilidad',
          icon:'pi pi-lock',
          command : ()=> this.mejora(),
          //routerLink: '/universidades',
          visible: this.authService.hasRole('ROLE_USER')
        },
      ]
    },
    {
      label:'Usuarios',
      icon:'pi pi-fw pi pi-fw pi-user',
      //routerLink: '/universidades',
      visible: this.authService.hasRole('ROLE_USER'),
      items:[
        {
            label:'Usuarios y Roles internos',
            icon:'pi pi-fw pi-id-card',
            routerLink: '/mantenimiento-usuario',
            visible: this.authService.hasRole('ROLE_USER')
        },
        {
            label:'Usuarios de Portal del Agremiado',
            icon:'pi pi-fw pi-lock-open',
            routerLink: '/portal-agremiado',
            visible: this.authService.hasRole('ROLE_USER')
        }
      ]
    },
    {
      label:'Reportes',
      icon:'pi pi-fw pi-chart-line',
      //routerLink: '/universidades',
      visible: this.authService.hasRole('ROLE_USER'),
      
      items:[
        {
          label:'FACTURAS',
          icon:'pi pi-fw pi-wallet',
          items:[
            {
              label:'Facturas por día',
              icon:'pi pi-fw pi-money-bill',
              routerLink: 'reportes/cobros',
              visible: this.authService.hasRole('ROLE_USER')
            },
            {
              label:'Facturas extornadas por día',
              icon:'pi pi-fw pi-trash',
              routerLink: 'reportes/extornos',
              visible: this.authService.hasRole('ROLE_USER')
            },
          ]
        },
        {
          label:'COLEGIADOS',
          icon:'pi pi-fw pi-users',
          items:[
            {
              label:'Cumpleaños de colegiados',
              icon:'pi pi-fw pi-filter-fill',
              routerLink: 'reportes/cumpleanios',
              visible: this.authService.hasRole('ROLE_USER')
            },
            {
              label:'Historial de pagos de un colegiado',
              icon:'pi pi-fw pi-sort-amount-up-alt',
              routerLink: 'reportes/historial-pagos',
              visible: this.authService.hasRole('ROLE_USER')
            },
            {
              label:'Reporte de Habilidades',
              icon:'pi pi-fw pi-book',
              routerLink: 'reportes/habilidades',
              visible: this.authService.hasRole('ROLE_USER')
            },
          ]
        },
        {
          label:'INCORPORACIONES',
          icon:'pi pi-fw pi-chart-line',
          items:[
            {
              label:'Incorporaciones del año',
              icon:'pi pi-fw pi-id-card',
              routerLink: 'reportes/incorporaciones',
              visible: this.authService.hasRole('ROLE_USER')
            },
            {
              label:'Incorporaciones Mensual',
              icon:'pi pi-fw pi-id-card',
              routerLink: 'reportes/incorporaciones-mensual',
              visible: this.authService.hasRole('ROLE_USER')
            },
          ]
        },
      ]
    },
    {
      label:'Páginas Web',
      icon:'pi pi-fw pi-globe',
      //routerLink: '/universidades',
      visible: this.authService.hasRole('ROLE_USER'),
      items:[
        {
            label:'Página Web ICAC',
            icon:'pi pi-fw pi-globe',
            command: ()=> this.linkExterno(),
            visible: this.authService.hasRole('ROLE_USER')
        },
        {
          label:'Página Web Consulta de HABILIDAD Y MULTAS',
          icon:'pi pi-fw pi-globe',
          command: ()=> this.linkExterno1(),
          visible: this.authService.hasRole('ROLE_USER')
        },
        {
          label:'Portal del AGREMIADO',
          icon:'pi pi-fw pi-globe',
          command: ()=> this.linkExterno2(),
          visible: this.authService.hasRole('ROLE_USER')
        },
      ]
    },
    {
        label:'Iniciar Sesión',
        icon:'pi pi-fw pi-sign-in',
        routerLink: '/login',
        visible: !this.authService.isAuthenticated()
    },
    {
      label:'Cerrar Sesión',
      icon:'pi pi-fw pi-sign-out',
      visible: this.authService.isAuthenticated(),
      items:[
          {
              label:this.authService.usuario.nombre+' '+this.authService.usuario.apellido,
              icon:'pi pi-fw pi-user'
          },
          {
            label:'FILIAL: '+this.filial,
            icon:'pi pi-fw pi-map-marker'
        },
          {
              separator:true
          },
          {
              label:'Cerrar Sesión',
              icon:'pi pi-fw pi-sign-out',
              command: ()=> this.logout()
          }
      ]
  },
  ];
  //verificar cumple
  this.verificarCumple();
  }
  linkExterno(){
    window.open("https://icacperu.org.pe/","target=_blank") 
  }
  linkExterno1(){
    window.open("https://icac-habilidad.web.app/","target=_blank") 
  }
  linkExterno2(){
    window.open("https://portal.icacperu.org.pe/","target=_blank") 
  }
  verificarCumple(){
    this.colegiadoService.getCumples().subscribe(colegiados => {
      this.colegiados = colegiados;
    })
  }
  showPositionDialog(position: string) {
    this.position = position;
    this.displayPosition = true;
}
rutear(){
  this.router.navigate(['/tramites/form',1]);    
  const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      window.location.reload();
    }, 10);
  });
}
mejora(){
  Swal.fire({
    title: 'CERTIFICACIÓN DE HABILIDAD DE COLEGIADO',
    text: 'URGENTE: Se requiere el modelo de certificado de HABILIDAD para concluir con la implementación.',
    imageUrl: '/assets/logoyawar.svg',
    imageWidth: 400,
    imageHeight: 200,
    imageAlt: 'Custom image',
    background: '#282C34',
    confirmButtonColor: '#545454'
  })
}
mejora1(){
  Swal.fire({
    title: 'MESA DE PARTES VIRTUAL - ICAC',
    text: 'Nueva funcionalidad disponible.',
    imageUrl: '/assets/logoyawar.svg',
    imageWidth: 400,
    imageHeight: 200,
    imageAlt: 'Custom image',
    background: '#282C34',
    confirmButtonColor: '#545454'
  })
}
obtenerFilial(){
  this.authService.usuario.filial;
  //tiposFilial = [{nombre:"CUSCO",valor:1},{nombre:"LA CONVENCION",valor:2},{nombre:"ESPINAR",valor:3},{nombre:"CANCHIS",valor:4}];
  switch(this.authService.usuario.filial) {
    case 1: {
      this.filial = 'CUSCO'
      break;
    }
    case 2: {
      this.filial = 'LA CONVENCION'
      break;
    }
    case 3: {
      this.filial = 'ESPINAR'
      break;
    }
    case 4: {
      this.filial = 'CANCHIS'
      break;
    }
  }
}
}
