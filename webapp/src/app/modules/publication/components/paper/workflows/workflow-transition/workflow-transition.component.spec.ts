import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowTransitionComponent } from './workflow-transition.component';

describe('WorkflowTransitionComponent', () => {
  let component: WorkflowTransitionComponent;
  let fixture: ComponentFixture<WorkflowTransitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowTransitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowTransitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
