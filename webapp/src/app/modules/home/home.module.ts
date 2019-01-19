import { NgModule } from '@angular/core'
import { HomeComponent } from './pages/home.component'
import { HomeRoutingModule } from './home-routing.module'
import { SharedModule } from '@app/shared/shared.module';
import { HeroComponent } from './components/hero/hero.component'

@NgModule({
  declarations: [
    HomeComponent,
    HeroComponent
  ],
  imports: [
    SharedModule,
    HomeRoutingModule
  ],
  exports: [],
  providers: []
})
export class HomeModule {}
