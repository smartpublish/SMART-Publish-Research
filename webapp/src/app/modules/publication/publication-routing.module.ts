import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { SubmitComponent } from './pages/submit/submit.component'
import { DetailComponent } from './pages/detail/detail.component'

export const routes: Routes = [
  { path: 'submit', component: SubmitComponent },
  { path: 'detail/:ethAddr', component: DetailComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicationRoutingModule { }
