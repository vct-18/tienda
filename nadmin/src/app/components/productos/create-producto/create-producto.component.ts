import {  Component, OnInit, AfterViewInit } from '@angular/core';

declare const Swal: any;
declare var tinymce: any;
declare var $: any; 
@Component({
  selector: 'app-create-producto',
  templateUrl: './create-producto.component.html',
  styleUrls: ['./create-producto.component.css']
})
export class CreateProductoComponent implements OnInit,AfterViewInit{

public producto : any={
  categoria: '' 
};

public file: File | undefined;

public imgSelect:any | ArrayBuffer = 'assets/adminlte/dist/img/noimg.jpg';

constructor(){

}

ngOnInit(): void {
  

}

  // Inicializa TinyMCE después de que se cargue la vista
  ngAfterViewInit(): void {
    tinymce.init({
      selector: '#editor',
      height: 300,
      license_key: 'gpl',
      plugins: 'link image code lists',
      toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | code',
      setup: (editor: any) => {
        editor.on('Change', () => {
          const content = editor.getContent();
          this.producto.contenido = content; // Vincula el contenido al modelo
        });
      }
    });
  }

  // Método para limpiar TinyMCE al destruir el componente
  ngOnDestroy(): void {
    tinymce.remove();
  }


registro(registroForm:any){

  if (registroForm.valid){
console.log(this.producto);
console.log(this.file);


  }else{
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Faltan campos por completar o no son validos. Por favor, revisa el formulario.',
      confirmButtonText: 'Aceptar',
    });
    $('#input-portada').text('seleccionar imagen');
          this.imgSelect='assets/adminlte/dist/img/noimg.jpg';
          this.file= undefined;
   
  }
  }

  fileChangeEvent(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = <File>event.target.files[0];
      

      if (file.size <= 4000000) {
        if (
          file.type === 'image/png' ||
          file.type === 'image/webp' ||
          file.type === 'image/jpg' ||
          file.type === 'image/gif' ||
          file.type === 'image/jpeg'
        ) {
          const reader = new FileReader();
          reader.onload = (e) => (this.imgSelect = reader.result);
          reader.readAsDataURL(file);

          $('#input-portada').text(file.name);
          this.file = file; // Almacena el archivo válido en la propiedad `file`.
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El archivo debe ser una imagen (png, jpg, jpeg, webp, gif).',
            confirmButtonText: 'Aceptar',
          });
          $('#input-portada').text('seleccionar imagen');
          this.imgSelect='assets/adminlte/dist/img/noimg.jpg';
          this.file= undefined;
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La imagen no puede superar los 4MB.',
          confirmButtonText: 'Aceptar',
        });
        $('#input-portada').text('seleccionar imagen');
        this.imgSelect='assets/adminlte/dist/img/noimg.jpg';
        this.file= undefined;
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se ha seleccionado ninguna imagen.',
        confirmButtonText: 'Aceptar',
      });
      $('#input-portada').text('seleccionar imagen');
      this.imgSelect='assets/adminlte/dist/img/noimg.jpg';
      this.file= undefined;
    }
    
    console.log(this.file);
    

  }
}

