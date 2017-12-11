import { Injectable } from '@angular/core';
import { KalturaClient } from "kaltura-ngx-client";
import { Observable } from "rxjs";

import { ConversionProfileListAction } from "kaltura-ngx-client/api/types/ConversionProfileListAction";
import { KalturaConversionProfileFilter } from "kaltura-ngx-client/api/types/KalturaConversionProfileFilter";
import { KalturaConversionProfileType } from "kaltura-ngx-client/api/types/KalturaConversionProfileType";
import { KalturaConversionProfileListResponse } from "kaltura-ngx-client/api/types/KalturaConversionProfileListResponse";
import { ConversionProfileAssetParamsListAction } from "kaltura-ngx-client/api/types/ConversionProfileAssetParamsListAction";
import { KalturaConversionProfileAssetParamsFilter } from "kaltura-ngx-client/api/types/KalturaConversionProfileAssetParamsFilter";
import { KalturaConversionProfileAssetParamsListResponse } from "kaltura-ngx-client/api/types/KalturaConversionProfileAssetParamsListResponse";
import { UiConfListTemplatesAction } from "kaltura-ngx-client/api/types/UiConfListTemplatesAction";
import { KalturaUiConfFilter } from "kaltura-ngx-client/api/types/KalturaUiConfFilter";
import { KalturaUiConfListResponse } from "kaltura-ngx-client/api/types/KalturaUiConfListResponse";
import { environment } from "../../environments/environment";

@Injectable()
export class PartnerInformationService {

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

  public getUiconfIdByTag(): Observable<KalturaUiConfListResponse> {
    return this._kalturaClient.request(new UiConfListTemplatesAction({
      filter: new KalturaUiConfFilter({
        tagsMultiLikeOr: environment.bootstrap.uiConf_id_tag
      })
    }));
  }
}
