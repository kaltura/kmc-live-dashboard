import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { TranslateService } from "ng2-translate";
import { NodeStreams } from "../types/live-dashboard.types";
import { KalturaEntryServerNodeType } from "kaltura-typescript-client/types/KalturaEntryServerNodeType";

@Pipe({
  name: 'transcodingInfo'
})
export class TranscodingInfoPipe implements PipeTransform {

  constructor(private _translate: TranslateService){}


  transform(allStreams: NodeStreams, arg?: KalturaEntryServerNodeType): string {
    if (KalturaEntryServerNodeType.livePrimary.equals(arg)) {
      return this.appendFormattedStream(allStreams.primary);
    }
    else {
      return this.appendFormattedStream(allStreams.secondary);
    }
  }

  private appendFormattedStream(arr: any, prefix?: string): string {
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
