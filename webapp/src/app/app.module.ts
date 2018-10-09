import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from "@app/core/core.module";
import { HomeModule } from "@app/modules/home/home.module";
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PublicationModule } from "@app/modules/publication/publication.module";

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

    // app
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
