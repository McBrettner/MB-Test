import { Routes, RouterModule } from '@angular/router';
import { App } from './app.component';
import { Admin } from './admin.component';
import { DataResolver } from './app.resolver';


export const ROUTES: Routes = [
  {path: '', component: App},
  {path: 'admin', component: Admin}
];

export const ROUTING = RouterModule.forRoot(ROUTES);
