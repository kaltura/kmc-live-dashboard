import { Injectable } from '@angular/core';
import { KalturaClient, KalturaClientConfiguration } from "@kaltura-ng/kaltura-client";
import { environment_dev } from "../environments/environment.dev";
import { environment } from "../environments/environment";

declare var window: any;

@Injectable()
export class BootstrapService {
  public initStatus: boolean = false;

  constructor(private _kalturaClient: KalturaClient, private _kalturaClientConfiguration: KalturaClientConfiguration) {
    this._initialize();
  }

  private _initialize(): void {
    let ks: string;
    let service_url: string;

    if (window && window.top && window.top.kmc && window.top.kmc.vars) {
      ks = window.top.kmc.vars.ks;
      service_url = window.top.kmc.vars.service_url;
    }
    else {
      // extract ks and service_url from query string
      ks = environment_dev.kaltura.ks;
      service_url = environment_dev.kaltura.service_url;
      environment.kaltura.entryId = environment_dev.kaltura.entryId;
    }

    if (ks && service_url) {
      this._kalturaClient.ks = ks;
      this._kalturaClient.endpointUrl = service_url;
      this._kalturaClientConfiguration.clientTag = 'KalturaLiveDashboard';

      this.initStatus = true;
    }
  }
}
