import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from "@angular/common/http";


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { routing } from "./app.routing";
import { InicioComponent } from './components/inicio/inicio.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';


import { IndexClienteComponent } from './components/clientes/index-cliente/index-cliente.component';
import { CreateClienteComponent } from './components/clientes/create-cliente/create-cliente.component';
import { EditClienteComponent } from './components/clientes/edit-cliente/edit-cliente.component';
import { RouterModule } from '@angular/router';
import { CreateProductoComponent } from './components/productos/create-producto/create-producto.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent, 
    SidebarComponent,
    FooterComponent,
    LoginComponent,
    IndexClienteComponent,
    CreateClienteComponent,
    EditClienteComponent,
    CreateProductoComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    routing,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
