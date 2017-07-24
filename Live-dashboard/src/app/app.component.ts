import {Component, OnInit} from '@angular/core';
import { BootstrapService } from "./bootstrap.service";
import {TranslateService} from "ng2-translate";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public _bootstrapInitStatus: boolean = false;

  constructor(private _bootstrapService: BootstrapService, private _translate: TranslateService) {
    let browserLang = this._translate.getBrowserLang();
    this._translate.use(browserLang.match(/de|en|es|fr|ja/) ? browserLang : 'en');
  }

  ngOnInit() {
    this._bootstrapInitStatus = this._bootstrapService.initStatus;
  }
}
