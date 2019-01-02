import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { WorkComponent } from './pages/work/work.component'
import { MyWorkRoutingModule } from './my-work-routing.module'
import { PaperListComponent } from './components/paper/paper-list/paper-list.component'
import { SharedModule } from '@app/shared/shared.module'

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MyWorkRoutingModule
  ],
  declarations: [WorkComponent, PaperListComponent]
})
export class MyWorkModule { }
