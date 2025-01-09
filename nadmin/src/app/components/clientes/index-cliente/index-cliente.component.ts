import { Component,OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { ClienteService } from 'src/app/services/cliente.service';
declare var $: any; 

declare const Swal: any;
@Component({
  selector: 'app-index-cliente',
  templateUrl: './index-cliente.component.html',
  styleUrls: ['./index-cliente.component.css']
})
export class IndexClienteComponent implements OnInit {

  public clientes: Array <any>=[];

  public token;

  constructor(
    private _clienteService: ClienteService,
private _adminService : AdminService

  ){this.token = this._adminService.getToken();
  

  }

  ngOnInit(): void{

    this._clienteService.listar_clientes_filtro_admin(this.token).subscribe({
      next: (response) => {
        this.clientes = response.data;
      
        setTimeout(() => {
          this.inicializarDataTable();
        }, 0); // Inicializa DataTables después del render
      
      },
      error: (error) => {
        console.error('Error:', error);
      }
  
    });
}

inicializarDataTable(): void {
  if ($.fn.DataTable.isDataTable('#example1')) {
    $('#example1').DataTable().destroy(); // Destruye cualquier instancia previa
  }
  $('#example1').DataTable({
    responsive: true,
    lengthChange: false,
    autoWidth: false,
    deferRender: true, // Procesa solo los elementos visibles primero
    language:{
      url:"/assets/i18n/es-ES.json"
    },
    columnDefs: [
      {
        targets: '_all', // Aplica a todas las columnas
        className: 'dt-left' // Clase personalizada para alinear el contenido a la izquierda
      }
    ],
    layout: {
      topStart: {
        buttons: [
          {
            extend: 'copy',
            title: 'NombrePersonalizado', // Cambia el nombre del archivo aquí
          },
          
          {
            extend: 'excel',
            title: 'NombrePersonalizado', // Cambia el nombre del archivo aquí
          },
          {
            extend: 'pdf',
            title: 'NombrePersonalizado',
            
            pageSize: 'A4', // Tamaño de la página
            exportOptions: {
              columns: ':not(:last-child)' // Excluye la última columna (opciones)
            },
            customize: (doc: any) => {
              // Centrar la tabla
              const tableBody = doc.content[1].table.body; // Accede al cuerpo de la tabla
              const columnCount = tableBody[0].length; // Número de columnas
              doc.content[1].table.widths = Array(columnCount).fill('*'); // Uniforme para todas las columnas
    
              // Opcional: Añadir márgenes para el PDF
              doc.pageMargins = [40, 60, 40, 60]; // Márgenes: Izquierda, Arriba, Derecha, Abajo
    
              // Alinear la tabla al centro de la página
              doc.content[1].alignment = 'center';
            }
          },
          {
            extend: 'print',
            title: 'NombrePersonalizado' // Cambia el nombre del archivo aquí
          }
          
        ]
      }
  }
});
}


eliminar(id:any){
 // Configuración inicial del SweetAlert
 const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success mx-2", // Márgenes horizontales
    cancelButton: "btn btn-danger mx-2",  // Márgenes horizontales
  },
  buttonsStyling: false,
})  ;

// Mostrar SweetAlert para confirmar la eliminación
swalWithBootstrapButtons
  .fire({
    title: "¿Estás seguro?",
    text: "No podrás deshacer esta acción.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    reverseButtons: false,
  })
  .then((result: any) => {
    if (result.isConfirmed) {
      // Si el usuario confirma, realizar la eliminación
      this._clienteService.eliminar_cliente_admin(id, this.token).subscribe({
        next: (response) => {
          console.log( response); 
          // Mostrar SweetAlert de éxito
          swalWithBootstrapButtons.fire(
            "Eliminado",
            "El cliente ha sido eliminado correctamente.",
            "success"
          );
   // Actualizar la tabla eliminando el cliente localmente
   this.clientes = this.clientes.filter((cliente) => cliente._id !== id);
        
        },
        error: (err) => {
          console.error("Error al eliminar el cliente:", err);
          // Mostrar SweetAlert de error
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo eliminar el cliente. Por favor, inténtalo más tarde.",
            confirmButtonText: "Aceptar",
          });
        },
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // Si el usuario cancela, mostrar mensaje de cancelación
      swalWithBootstrapButtons.fire(
        "Cancelado",
        "El cliente no fue eliminado.",
        "error"
      );
    }
  });
}
}