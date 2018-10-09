import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.scss']
})
export class ShowcaseComponent implements OnInit {

  @Input() title = 'Showcase'
  @Input() description = 'Showcase description'
  @Input() items: any[] = [
    {"title":"Paper 1", "subtitle":"This is a paper", "description": "Lore ipsum ipsum ipsum...."},
    {"title":"Paper 1", "subtitle":"This is a paper", "description": "Lore ipsum ipsum ipsum...."},
    {"title":"Paper 1", "subtitle":"This is a paper", "description": "Lore ipsum ipsum ipsum...."},
    {"title":"Paper 1", "subtitle":"This is a paper", "description": "Lore ipsum ipsum ipsum...."}
  ];

  constructor() { }

  ngOnInit() {
  }

}
