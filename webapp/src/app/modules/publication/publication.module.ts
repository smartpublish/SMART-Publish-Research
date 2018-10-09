import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublishComponent } from './pages/publish/publish.component';
import { PaperNewComponent } from './components/paper/paper-new.component';
import { PublicationRoutingModule } from "./publication-routing.module";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PublicationRoutingModule
  ],
  declarations: [
    PublishComponent,
    PaperNewComponent
  ],
  exports: [
    PublishComponent
  ]
})
export class PublicationModule { }
