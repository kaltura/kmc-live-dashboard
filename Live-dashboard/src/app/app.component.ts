import {Component, OnInit} from '@angular/core';
import { BootstrapService } from "./bootstrap.service";
import {TranslateService} from "ng2-translate";
import { environment_dev } from "../environments/environment.dev";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public _bootstrapInitStatus: boolean = false;

  constructor(private _bootstrapService: BootstrapService, private _translate: TranslateService) {
    let browserLang = environment_dev.kaltura.i18n;
    this._translate.use(browserLang.match(/de|en|es|fr|ja/) ? browserLang : 'en');
  }

  ngOnInit() {
    this._bootstrapInitStatus = this._bootstrapService.initStatus;
  }
}
