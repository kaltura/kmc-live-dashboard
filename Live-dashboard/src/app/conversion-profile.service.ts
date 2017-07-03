import { Injectable } from '@angular/core';
import { KalturaClientConfiguration, KalturaClient } from "@kaltura-ng/kaltura-client";
import { ConversionProfileListAction } from "kaltura-typescript-client/types/ConversionProfileListAction";
import { KalturaConversionProfileFilter } from "kaltura-typescript-client/types/KalturaConversionProfileFilter";
import { KalturaConversionProfileType } from "kaltura-typescript-client/types/KalturaConversionProfileType";
import { KalturaConversionProfileListResponse } from "kaltura-typescript-client/types/KalturaConversionProfileListResponse";
import { Observable } from "rxjs";

@Injectable()
export class ConversionProfileService {

  constructor(private _kalturaClient: KalturaClient) { }

  public getConversionProfiles(): Observable<KalturaConversionProfileListResponse> {
    return this._kalturaClient.request(new ConversionProfileListAction({
      filter: new KalturaConversionProfileFilter({
        typeEqual: KalturaConversionProfileType.liveStream
      })
    }));
  }

}
