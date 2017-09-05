import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import {TranslateService} from "ng2-translate";
import {NodeStreams} from "../types/live-dashboard.types";

@Pipe({
  name: 'transcodingInfo'
})
export class TranscodingInfoPipe implements PipeTransform {

  constructor(private _translate: TranslateService){}


  transform(allStreams: NodeStreams, args?: any): any {
    let transcoding = '';

    transcoding += this.appendFormattedStream(allStreams.primary,   this._translate.instant('COMMON.primary'));
    transcoding += this.appendFormattedStream(allStreams.secondary, this._translate.instant('COMMON.secondary'));

    return transcoding;
  }

  private appendFormattedStream(arr: any, prefix: string) {
    let transcoding = '';
    let sortedStreamsArr;

    if (_.isArray(arr) && arr.length > 0) {
      if (prefix) {
        transcoding =  prefix + '\n';
      }

      sortedStreamsArr = _.sortBy(arr, (stream) => {
        return (-stream.bitrate);
      });  // '-' minus sign is for desc

      _.forEach(sortedStreamsArr, (stream) => {
        transcoding += `${stream.width}x${stream.height} @ ${Math.floor(stream.bitrate / 1024)}Kbps `;
      });
    }
    return transcoding;
  }
}
