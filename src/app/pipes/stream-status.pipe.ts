import { Pipe, PipeTransform } from '@angular/core';
import { KalturaEntryServerNodeStatus } from "kaltura-typescript-client/types/KalturaEntryServerNodeStatus";

@Pipe({
  name: 'streamStatus'
})
export class StreamStatusPipe implements PipeTransform {

  transform(entryServerNodeStatus: KalturaEntryServerNodeStatus): 'Live' | 'Initializing' | 'Offline' {
    switch (entryServerNodeStatus) {
      case KalturaEntryServerNodeStatus.broadcasting:
        return 'Initializing';
      case KalturaEntryServerNodeStatus.playable:
        return 'Live';
      case KalturaEntryServerNodeStatus.stopped:
      default:
        return 'Offline'
    }
  }

}
