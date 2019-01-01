import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from "@app/core/core.module";
import { SharedModule } from '@app/shared/shared.module';
import { HomeModule, PublicationModule, MyWorkModule} from "@app/modules";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // Angular
    BrowserModule,

    // 3ed party

    // core & shared
    CoreModule,
    SharedModule,

    // features
    HomeModule,
    PublicationModule,
    MyWorkModule,
    
    // app
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
