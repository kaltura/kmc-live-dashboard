import { Injectable } from '@angular/core';

import {KalturaRequest} from "../kaltura-request";

@Injectable()
export class BaseEntryService {

    constructor(){
    }

    static list(search: string = '', filter: any = {}, responseProfile: any = {}, pageSize: number = 30, pageIndex: number = 1): KalturaRequest<any> {

        const parameters :any = {
          pager: {
            objectType: "KalturaFilterPager",
            pageSize: pageSize,
            pageIndex: pageIndex
          },
          responseProfile: Object.assign({}, responseProfile),
          filter: Object.assign({}, filter)
        };

        if (search.length){
          Object.assign(parameters.filter, {freeText: search});
        }

        return new KalturaRequest<any>('baseEntry', 'list', parameters);
    }

}
