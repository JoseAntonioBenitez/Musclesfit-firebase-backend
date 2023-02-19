import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/services/auth.guard';
import { LoginPage } from './login/login.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate:[AuthGuard]
  },
  {
    path: 'exercises',
    loadChildren: () => import('./pages/workouts/workout.module').then( m => m.WorkoutPageModule)
  },
  {
    path: 'equipment',
    loadChildren: () => import('./pages/equipment/equipment.module').then( m => m.EquipmentPageModule)
  },
  {
    path: 'category',
    loadChildren: () => import('./pages/category/category.module').then( m => m.CategoryPageModule)
  },
  {
    path: 'aboutme',
    loadChildren: () => import('./pages/aboutme/aboutme.module').then( m => m.AboutmePageModule)
  }
  


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
