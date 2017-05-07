import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/primeng';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private items: MenuItem[];

  ngOnInit() {
    this.items = [
      {label: 'Setup and Preview'}
    ];
  }
}
