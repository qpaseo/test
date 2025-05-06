// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./page/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: '/:id',
    loadChildren: () =>
      import('./page/detail/detail.module').then((m) => m.DetailModule),
  },
  {
    path: '/add',
    loadChildren: () =>
      import('./page/add/add.module').then((m) => m.AddModule),
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
