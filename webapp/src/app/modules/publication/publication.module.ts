import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitComponent } from './pages/submit/submit.component';
import { PublicationRoutingModule } from "./publication-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { PaperNewComponent } from './components/paper/paper-new.component';
import { PaperDetailComponent } from './components/paper/paper-detail.component';
import { DetailComponent } from './pages/detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PublicationRoutingModule
  ],
  declarations: [
    SubmitComponent,
    PaperNewComponent,
    PaperDetailComponent,
    DetailComponent
  ],
  exports: [
    SubmitComponent
  ]
})
export class PublicationModule { }
