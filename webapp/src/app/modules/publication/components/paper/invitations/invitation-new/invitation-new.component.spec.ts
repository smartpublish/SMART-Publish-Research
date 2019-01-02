import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { InvitationNewComponent } from './invitation-new.component'

describe('InvitationNewComponent', () => {
  let component: InvitationNewComponent
  let fixture: ComponentFixture<InvitationNewComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitationNewComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationNewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
