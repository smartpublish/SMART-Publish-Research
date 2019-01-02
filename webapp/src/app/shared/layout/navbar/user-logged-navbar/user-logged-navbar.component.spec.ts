import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { UserLoggedNavbarComponent } from './user-logged-navbar.component'

describe('UserLoggedNavbarComponent', () => {
  let component: UserLoggedNavbarComponent
  let fixture: ComponentFixture<UserLoggedNavbarComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLoggedNavbarComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLoggedNavbarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
