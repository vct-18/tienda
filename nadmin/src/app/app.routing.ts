import { Routes,RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component'; // Ajusta la ruta al componente según corresponda

import { AdminGuard } from './guards/admin.guard';

 const appRoute: Routes = [
    { path: '', component: InicioComponent,canActivate: [AdminGuard] },   
    { path: 'login', component: LoginComponent }
]

    export const AppRoutingProviders : any[]=[];
    export const routing : ModuleWithProviders <any> = RouterModule.forRoot(appRoute);