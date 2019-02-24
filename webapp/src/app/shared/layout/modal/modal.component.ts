import { Component, Input, TemplateRef  } from '@angular/core'
import { BsModalService } from 'ngx-bootstrap/modal'
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service'

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  @Input() title
  @Input() openButtonName

  modalRef: BsModalRef
  constructor(private modalService: BsModalService) {}

  open(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template)
  }

  close() {
    this.modalRef.hide()
  }
  
  ngOnInit() {
  }

}
