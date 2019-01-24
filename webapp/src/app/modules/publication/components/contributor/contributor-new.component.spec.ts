import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ContributorNewComponent } from './contributor-new.component'

describe('ContributorNewComponent', () => {
  let component: ContributorNewComponent
  let fixture: ComponentFixture<ContributorNewComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContributorNewComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributorNewComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
