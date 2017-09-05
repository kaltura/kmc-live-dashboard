import { Injectable } from '@angular/core';
import { KalturaClient } from "@kaltura-ng/kaltura-client";
import { Observable } from "rxjs";

import { ConversionProfileListAction } from "kaltura-typescript-client/types/ConversionProfileListAction";
import { KalturaConversionProfileFilter } from "kaltura-typescript-client/types/KalturaConversionProfileFilter";
import { KalturaConversionProfileType } from "kaltura-typescript-client/types/KalturaConversionProfileType";
import { KalturaConversionProfileListResponse } from "kaltura-typescript-client/types/KalturaConversionProfileListResponse";
import { ConversionProfileAssetParamsListAction } from "kaltura-typescript-client/types/ConversionProfileAssetParamsListAction";
import { KalturaConversionProfileAssetParamsFilter } from "kaltura-typescript-client/types/KalturaConversionProfileAssetParamsFilter";
import { KalturaConversionProfileAssetParamsListResponse } from "kaltura-typescript-client/types/KalturaConversionProfileAssetParamsListResponse";

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

  public getConversionProfileFlavors(id: number): Observable<KalturaConversionProfileAssetParamsListResponse> {
    return this._kalturaClient.request(new ConversionProfileAssetParamsListAction({
      filter: new KalturaConversionProfileAssetParamsFilter({
        conversionProfileIdEqual: id
      })
    }));
  }
}
