import {Component, OnInit} from '@angular/core';
import { BootstrapService } from "./bootstrap.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public _bootstrapInitStatus: boolean = false;

  constructor(private _boostrapService: BootstrapService) { }

  ngOnInit() {
    this._bootstrapInitStatus = this._boostrapService.initStatus;
  }
}
