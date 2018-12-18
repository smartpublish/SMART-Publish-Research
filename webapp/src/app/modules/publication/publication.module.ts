import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitComponent } from './pages/submit/submit.component';
import { PublicationRoutingModule } from "./publication-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { PaperNewComponent } from './components/paper/paper-new.component';
import { PaperDetailComponent } from './components/paper/paper-detail.component';
import { DetailComponent } from './pages/detail/detail.component';
import { CommentNewComponent } from './components/paper/comments/comment-new/comment-new.component';
import { CommentListComponent } from './components/paper/comments/comment-list/comment-list.component';
import { CommentsComponent } from './components/paper/comments/comments.component';
import { SharedModule } from '@app/shared/shared.module';
import { WorkflowsComponent } from './components/paper/workflows/workflows.component';
import { WorkflowTransitionComponent } from './components/paper/workflows/workflow-transition/workflow-transition.component';
import { ContributorNewComponent } from './components/contributor/contributor-new.component';
import { InvitationsComponent } from './components/paper/invitations/invitations.component';
import { InvitationNewComponent } from './components/paper/invitations/invitation-new/invitation-new.component';
import { InvitationListComponent } from './components/paper/invitations/invitation-list/invitation-list.component'

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PublicationRoutingModule,
    SharedModule
  ],
  declarations: [
    SubmitComponent,
    PaperNewComponent,
    PaperDetailComponent,
    DetailComponent,
    CommentNewComponent,
    CommentListComponent,
    CommentsComponent,
    WorkflowsComponent,
    WorkflowTransitionComponent,
    ContributorNewComponent,
    InvitationsComponent,
    InvitationNewComponent,
    InvitationListComponent
  ],
  exports: [
    SubmitComponent
  ]
})
export class PublicationModule { }
