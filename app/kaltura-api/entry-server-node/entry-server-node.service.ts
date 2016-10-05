import { Injectable } from '@angular/core';

import {KalturaRequest} from "../kaltura-request";

@Injectable()
export class EntryServerNodeService {

  constructor(){
  }

  static list(filter: any = {}, responseProfile: any = {}, pageSize: number = 30, pageIndex: number = 1): KalturaRequest<any> {

    const parameters :any = {
      pager: {
        objectType: "KalturaFilterPager",
        pageSize: pageSize,
        pageIndex: pageIndex
      },
      responseProfile: Object.assign({}, responseProfile),
      filter: Object.assign({'objectType':'KalturaLiveEntryServerNodeFilter'}, filter)
    };

    return new KalturaRequest<any>('entryServerNode', 'list', parameters);
  }

}
