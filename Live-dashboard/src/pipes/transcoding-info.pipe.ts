import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'transcodingInfo'
})
export class TranscodingInfoPipe implements PipeTransform {

  transform(streamsArr: any, args?: any): any {
    let transcoding = '';
    let sortedStreamsArr;

    if (_.isArray(streamsArr)){
      sortedStreamsArr = _.sortBy(streamsArr, [(stream) => { return (-stream.bitrate); }]);  // '-' minus sign is for desc

      _.forEach(sortedStreamsArr, (stream) => {
        transcoding += `${stream.width}x${stream.height} @ ${Math.floor(stream.bitrate/1024)} Kbps `;
      });
    }

    return transcoding;
  }
}
