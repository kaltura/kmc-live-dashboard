import { Injectable } from '@angular/core';

import {KalturaRequest} from "../kaltura-request";

@Injectable()
export class LiveAnalyticsService {

  constructor(){
  }

  static getEvents(reportType: string ='', filter: any = {}, responseProfile: any = {}, pageSize: number = 30, pageIndex: number = 1): KalturaRequest<any> {

    const parameters :any = {
      pager: {
        objectType: "KalturaFilterPager",
        pageSize: pageSize,
        pageIndex: pageIndex
      },
      responseProfile: Object.assign({}, responseProfile),
      filter: Object.assign({'objectType':'KalturaLiveReportInputFilter'}, filter),
      action: 'getEvents',
      reportType: reportType
    };

    return new KalturaRequest<any>('liveReports', 'getEvents', parameters);
  }

}
