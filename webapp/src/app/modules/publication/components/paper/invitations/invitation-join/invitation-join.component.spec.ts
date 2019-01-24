import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { InvitationJoinComponent } from './invitation-join.component'

describe('InvitationJoinComponent', () => {
  let component: InvitationJoinComponent
  let fixture: ComponentFixture<InvitationJoinComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitationJoinComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationJoinComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
