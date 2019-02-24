import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { WorkComponent } from './pages/work/work.component'
import { AuthGuard } from '@app/core/guards/auth.guard'

export const routes: Routes = [
  { path: 'work', component: WorkComponent, canActivate: [AuthGuard] }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyWorkRoutingModule { }
