import { Injectable } from '@angular/core';
import { KalturaClient, KalturaClientConfiguration } from "kaltura-ngx-client";
import { LiveDashboardConfiguration } from "./services/live-dashboard-configuration.service";
import { Observable } from "rxjs/Observable";
import { environment } from "../environments/environment";
import { AppLocalization } from "@kaltura-ng/kaltura-common";
import { ApplicationMode } from "./types/live-dashboard.types";

declare var window: any;

@Injectable()
export class BootstrapService {

  constructor(private _kalturaClient: KalturaClient,
              private _kalturaClientConfiguration: KalturaClientConfiguration,
              private _liveDashboardConfiguration: LiveDashboardConfiguration,
              private _appLocalization: AppLocalization) {
  }

  public initialize(): Observable<any> {
    if (window && window.top) {
      this._liveDashboardConfiguration.player = {};

      if (window.top.kmc && window.top.kmc.vars && window.top.kmc.vars.liveDashboard) {
        this._liveDashboardConfiguration.mode =             ApplicationMode.Default;
        this._liveDashboardConfiguration.ks =               window.top.kmc.vars.ks;
        this._liveDashboardConfiguration.service_url =      window.top.kmc.vars.service_url;
        this._liveDashboardConfiguration.entryId =          window.top.kmc.vars.liveDashboard.entryId;
        this._liveDashboardConfiguration.version =          window.top.kmc.vars.liveDashboard.version;
        this._liveDashboardConfiguration.lang =             window.top.lang ? window.top.lang : 'en';
      }
      else if (window.top.webcast && window.top.webcast.vars && window.top.webcast.vars.liveDashboard) {
        this._liveDashboardConfiguration.mode =             window.top.webcast.vars.liveDashboard.mode === 'webcast' ? ApplicationMode.Webcast : ApplicationMode.Default;
        this._liveDashboardConfiguration.ks =               window.top.webcast.vars.liveDashboard.ks;
        this._liveDashboardConfiguration.service_url =      window.top.webcast.vars.liveDashboard.service_url;
        this._liveDashboardConfiguration.entryId =          window.top.webcast.vars.liveDashboard.entryId;
        this._liveDashboardConfiguration.version =          window.top.webcast.vars.liveDashboard.version;
        this._liveDashboardConfiguration.lang =             window.top.webcast.vars.liveDashboard.lang ? window.top.webcast.vars.liveDashboard.lang : 'en';
      }
    }

    if (this._liveDashboardConfiguration.ks && this._liveDashboardConfiguration.service_url && this._liveDashboardConfiguration.entryId) {
      this._kalturaClient.ks = this._liveDashboardConfiguration.ks;
      this._kalturaClient.endpointUrl = this._liveDashboardConfiguration.service_url + environment.bootstrap.service_url_extension;
      this._kalturaClientConfiguration.clientTag = 'KalturaLiveDashboard';

      console.log('Bootstrap service started successfully');
      // init i18n - Set english as default language and initialize localization service
      // use only prefix (e.g: all english begin with en-xx)
      let browserLang = this._liveDashboardConfiguration.lang.substr(0, 2);
      return this._appLocalization.load(browserLang, environment.bootstrap.default_lang);
    }
    else {
      console.log('Bootstrap service failed to start');
      return Observable.throw(new Error('missing parameters'));
    }
  }
}
