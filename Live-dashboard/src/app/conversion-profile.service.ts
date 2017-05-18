import { Injectable } from '@angular/core';
import { KalturaClientConfiguration, KalturaClient } from "@kaltura-ng/kaltura-client";
import { ConversionProfileListAction } from "kaltura-typescript-client/types/ConversionProfileListAction";
import { KalturaConversionProfileFilter } from "kaltura-typescript-client/types/KalturaConversionProfileFilter";
import { KalturaConversionProfileType } from "kaltura-typescript-client/types/KalturaConversionProfileType";
import { KalturaConversionProfileListResponse } from "kaltura-typescript-client/types/KalturaConversionProfileListResponse";
import { Observable } from "rxjs";

@Injectable()
export class ConversionProfileService {

  constructor(private _kalturaClient: KalturaClient, private _kalturaClientConfig: KalturaClientConfiguration) {
    _kalturaClientConfig.ks = 'ODFkZjUzZDQ5YzZhNDM0MDg4ZTJiODdhY2MwYmIzNzJmMTVkMWZiNnwxMDI7MTAyOzE0OTU3MDQyODY7MjsxNDkzMTEyMjg2LjY0MjI7Ozs7';
    _kalturaClientConfig.clientTag = 'KalturaLiveDashboard';
    _kalturaClientConfig.endpointUrl = 'http://10.0.80.11/api_v3/index.php';
  }

  public getConversionProfiles(): Observable<KalturaConversionProfileListResponse> {
    return this._kalturaClient.request(new ConversionProfileListAction({
      filter: new KalturaConversionProfileFilter({
        typeEqual: KalturaConversionProfileType.liveStream
      })
    }));
  }

}
