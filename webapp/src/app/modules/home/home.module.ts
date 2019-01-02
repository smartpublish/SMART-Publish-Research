import { NgModule } from '@angular/core'
import { HomeComponent } from './pages/home.component'
import { HomeRoutingModule } from './home-routing.module'
import { SharedModule } from '@app/shared/shared.module'

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    SharedModule,
    HomeRoutingModule
  ],
  exports: [],
  providers: []
})
export class HomeModule {}
