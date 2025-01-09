import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ClienteService } from 'src/app/services/cliente.service';


declare const Swal: any;

@Component({
  selector: 'app-edit-cliente',
  templateUrl: './edit-cliente.component.html',
  styleUrls: ['./edit-cliente.component.css']
})
export class EditClienteComponent implements OnInit {

    
    public cliente :any = {
      genero:'',
      dia: '',
        mes: '',
        anio: ''
    };
    public dias: number[] = [];
    public meses: string[] = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    public anios: number[] = [];
    public fechaValida: boolean = true;
    public fechaTocada: boolean = false;
    public id:any;
    public token;


  constructor(
    
    private _route :ActivatedRoute,
    private _clienteService:ClienteService,
    private _adminService:AdminService,
    private _router :Router

  ){this.token = this._adminService.getToken();

  }


  ngOnInit(): void {
    this.inicializarFechas();

    this._route.params.subscribe({
      next: (params) => {
        this.id = params['id']

        this._clienteService.obtener_cliente_admin(this.id, this.token).subscribe({
          next: (response) => {
            console.log(response);
            if(response.data == undefined){
              
              this.cliente = undefined;
            } else {
              // Asignar todos los datos del cliente
              this.cliente = response.data;
        
              // Descomponer `f_nacimiento` en `dia`, `mes`, y `anio`
              if (this.cliente.f_nacimiento && this.cliente.f_nacimiento.includes('/')) {
                const [dia, mes, anio] = this.cliente.f_nacimiento.split('/');
                this.cliente.dia = parseInt(dia); // Día en formato de cadena
                this.cliente.mes = parseInt(mes); // Convertir el mes a número
                this.cliente.anio = anio; // Año como cadena
                 // Validar la fecha y marcar como tocada
        this.validarFecha();
        this.fechaTocada = this.fechaValida; // Marcar `fechaTocada` si la fecha es válida
      
              } else {
                console.warn('El formato de fecha no es válido o está vacío.');
              }
            }
          },
          error: (error) => {
            console.error('Error al obtener cliente:', error);
          },
        });
  }
});
    
  }



inicializarFechas(): void {
  this.dias = Array.from({ length: 31 }, (_, i) => i + 1);

  const anioActual = new Date().getFullYear();
  const anioMaximo = anioActual - 18; // Edad mínima: 18 años
  this.anios = Array.from({ length: anioMaximo - 1899 }, (_, i) => 1900 + i); // Desde 1900 hasta el año permitido
}

validarFecha(): void {
  const { dia, mes, anio } = this.cliente;

  // Verifica si algún campo está vacío
  if (!dia || !mes || !anio) {
    this.fechaValida = false;
    return;
  }

  // Valida la fecha real
  const fecha = new Date(anio, mes - 1, dia);
  this.fechaValida =
    fecha.getDate() === +dia &&
    fecha.getMonth() === +mes - 1 &&
    fecha.getFullYear() === +anio;
}

actualizarFechaNacimiento(): void {
  const { dia, mes, anio } = this.cliente;

  // Marca que los campos de fecha han sido tocados
  this.fechaTocada = true;

  // Verifica si la fecha está completa y es válida
  if (!dia || !mes || !anio) {
    this.fechaValida = false; // Marca como inválida si falta algún campo
    return;
  }

  // Valida que la fecha sea real
  const fecha = new Date(anio, mes - 1, dia);
  this.fechaValida =
    fecha.getDate() === +dia &&
    fecha.getMonth() === +mes - 1 &&
    fecha.getFullYear() === +anio;

  // Actualiza el formato de la fecha si es válida
  if (this.fechaValida) {
    const mesFormateado = mes < 10 ? `0${mes}` : mes;
    const diaFormateado = dia < 10 ? `0${dia}` : dia;
    this.cliente.f_nacimiento = `${diaFormateado}/${mesFormateado}/${anio}`;
  }
}



validarTexto(event: any, control: NgModel): void {
  const input = event.target;
  const valor = input.value;

  // Permitir solo letras (incluyendo tildes y ñ) y espacios
  const valorFiltrado = valor.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
  if (valor !== valorFiltrado) {
    input.value = valorFiltrado;
    control.control.setValue(valorFiltrado); // Actualiza el modelo en Angular
  }
}

validarNumeros(event: any, control: NgModel): void {
  const input = event.target;
  const valor = input.value;

  // Permitir solo números
  const valorFiltrado = valor.replace(/[^0-9]/g, '');

  if (valor !== valorFiltrado) {
    input.value = valorFiltrado;
    control.control.setValue(valorFiltrado);
  }
}

validarEmail(event: any, control: NgModel): void {
  const input = event.target;
  const valor = input.value;

  // Expresión regular para validar correos electrónicos
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Validar correo y actualizar el modelo si es inválido
  if (!emailRegex.test(valor)) {
    control.control.setErrors({ invalidEmail: true });
  } else {
    control.control.setErrors(null);
  }
}




  actualizar(updateForm:any){
    Object.keys(updateForm.controls).forEach(controlName => {
      updateForm.controls[controlName].markAsTouched();
    });
  
  
    this.fechaTocada = true; // Marca que se intentó registrar
    this.validarFecha(); // Valida la fecha
  // Si la fecha no es válida, no se continúa
  
  
  // Validación del formulario
  if (!updateForm.valid || !this.fechaValida) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Faltan campos por completar o no son validos. Por favor, revisa el formulario.',
      confirmButtonText: 'Aceptar',
    });
    return;
  }
  
   // Llamada al servicio para registrar al cliente
   this._clienteService.actualizar_cliente_admin(this.id,this.cliente, this.token).subscribe({
    next: (response) => {
      console.log('Respuesta de la API:', response); // Imprime la respuesta completa
       // Supón que la respuesta es exitosa si llega aquí
    Swal.fire({
      icon: 'success',
      title: 'Guardado',
      text: 'El cliente se ha registrado correctamente.',
      confirmButtonText: 'Aceptar',
    }).then(() => {
      // Redirige a la tabla de clientes
      this._router.navigate(['/clientes']);
    });
    
  
        // Limpia el formulario y reinicia el modelo del cliente
        updateForm.resetForm();
        this.cliente = {
          genero: '',
          nombres: '',
          apellidos: '',
          f_nacimiento: '',
          telefono: '',
          dni: '',
          email: '',
          dia: '',
          mes: '',
          anio: '',
        };
        
        
  
        // Restablece explícitamente los valores predeterminados para los selectores
        this.fechaValida = true;
        this.fechaTocada = false;
      },
    
    error: (err) => {
      // Manejo de errores en caso de que la API falle
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al registrar el cliente. Por favor, inténtelo más tarde.',
        confirmButtonText: 'Aceptar',
      });
      console.error(err);
    }
  });
  
  
  }
  
  }

