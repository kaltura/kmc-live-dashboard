import { Injectable } from '@angular/core';

import {KalturaRequest} from "../kaltura-request";

@Injectable()
export class UIConfService {

  constructor(){
  }

  public static list(): KalturaRequest<any> {

    let responseProfile:any = {
      "objectType": "KalturaDetachedResponseProfile",
      "type": "1",
      "fields": "id,name"
    };

    const parameters :any = {
      pager: {
        objectType: "KalturaFilterPager",
        pageSize: 1000,
        pageIndex: 1
      },
      responseProfile: Object.assign({}, responseProfile),
      filter: { "objTypeEqual": 1 }
    };
    return new KalturaRequest<any>('uiconf', 'list', parameters);
  }


}
