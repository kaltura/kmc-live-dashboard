import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { TranslateService } from "ng2-translate";
import { NodeStreams } from "../types/live-dashboard.types";
import { KalturaEntryServerNodeType } from "kaltura-typescript-client/types/KalturaEntryServerNodeType";

@Pipe({
  name: 'transcodingInfo'
})
export class TranscodingInfoPipe implements PipeTransform {

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
    let sortedFlavorsArr;

    if (_.isArray(arr) && arr.length > 0) {
      if (prefix) {
        transcoding =  prefix + '\n';
      }

      sortedFlavorsArr = _.sortBy(arr, flavor => {
        return (-flavor.bitrate_kbps);
      });  // '-' minus sign is for desc

      _.forEach(sortedFlavorsArr, flavor => {
        transcoding += `${flavor.mediaInfo.resolution[0]}x${flavor.mediaInfo.resolution[1]} @ ${flavor.mediaInfo.bitrate_kbps}Kbps `;
      });
    }
    return transcoding;
  }
}
