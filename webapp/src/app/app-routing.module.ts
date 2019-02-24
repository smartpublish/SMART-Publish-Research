import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { NotFoundComponent } from './core/components/not-found/not-found.component'

export const routes: Routes = [
  // TODO Refactor: NotFoundComponent is from Core but its route evaulation is before
  // of feature module, so always is NotFound. In order to last evaluation is here
  { path: '**', pathMatch: 'full', component: NotFoundComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
