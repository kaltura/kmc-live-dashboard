import { Injectable } from '@angular/core';
import { KalturaClient, KalturaClientConfiguration } from "@kaltura-ng/kaltura-client";
import { LiveDashboardConfiguration } from "./services/live-dashboard-configuration.service";
import { Observable } from "rxjs/Observable";
import { TranslateService } from "ng2-translate";
import { environment } from "../environments/environment";

declare var window: any;

@Injectable()
export class BootstrapService {

  constructor(private _kalturaClient: KalturaClient,
              private _kalturaClientConfiguration: KalturaClientConfiguration,
              private _liveDashboardConfiguration: LiveDashboardConfiguration,
              private _translate: TranslateService) {
  }

  public initialize(): Observable<any> {
    if (window && window.top && window.top.kmc && window.top.kmc.vars && window.top.kmc.vars.liveDashboard) {
      this._liveDashboardConfiguration.ks =           window.top.kmc.vars.ks;
      this._liveDashboardConfiguration.service_url =  window.top.kmc.vars.service_url;
      this._liveDashboardConfiguration.entryId =      window.top.kmc.vars.liveDashboard.entryId;
      this._liveDashboardConfiguration.uiConfId =     window.top.kmc.vars.liveDashboard.uiConfId;
      this._liveDashboardConfiguration.lang =         window.top.lang ? window.top.lang : 'en';
    }

    if (this._liveDashboardConfiguration.ks && this._liveDashboardConfiguration.service_url && this._liveDashboardConfiguration.entryId) {
      this._kalturaClient.ks = this._liveDashboardConfiguration.ks;
      this._kalturaClient.endpointUrl = this._liveDashboardConfiguration.service_url + environment.bootstrap.service_url_extension;
      this._kalturaClientConfiguration.clientTag = 'KalturaLiveDashboard';

      // init i18n - Set default language
      this._translate.setDefaultLang(environment.bootstrap.default_lang);
      // use only prefix (e.g: all english begin with en-xx)
      let browserLang = this._liveDashboardConfiguration.lang.substr(0, 2);

      return this._translate.use(browserLang);
    }
    else {
      return Observable.throw(new Error('missing parameters'));
    }
  }
}
