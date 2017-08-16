import { Injectable } from '@angular/core';
import { KalturaClient, KalturaClientConfiguration } from "@kaltura-ng/kaltura-client";
import {LiveDashboardConfiguration} from "./services/live-dashboard-configuration.service";

declare var window: any;

@Injectable()
export class BootstrapService {
  public initStatus: boolean = false;

  constructor(private _kalturaClient: KalturaClient,
              private _kalturaClientConfiguration: KalturaClientConfiguration,
              private _liveDashboardConfiguration: LiveDashboardConfiguration) {
    this._initialize();
  }

  private _initialize(): void {
    if (window && window.top && window.top.kmc && window.top.kmc.vars) {
      this._liveDashboardConfiguration.ks =           window.top.kmc.vars.ks;
      this._liveDashboardConfiguration.service_url =  window.top.kmc.vars.service_url;
      this._liveDashboardConfiguration.entryId =      window.top.kmc.vars.entryId;
      this._liveDashboardConfiguration.host =         window.top.kmc.vars.host;
      this._liveDashboardConfiguration.uiConfId =     window.top.kmc.vars.uiConfId;
      this._liveDashboardConfiguration.lang =         window.top.lang;
    }

    if (this._liveDashboardConfiguration.ks && this._liveDashboardConfiguration.service_url) {
      this._kalturaClient.ks = this._liveDashboardConfiguration.ks;
      this._kalturaClient.endpointUrl = this._liveDashboardConfiguration.service_url;
      this._kalturaClientConfiguration.clientTag = 'KalturaLiveDashboard';

      this.initStatus = true;
    }
  }
}
