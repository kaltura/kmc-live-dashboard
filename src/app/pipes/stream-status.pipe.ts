import { Pipe, PipeTransform } from '@angular/core';
import { KalturaEntryServerNodeStatus } from "kaltura-typescript-client/types/KalturaEntryServerNodeStatus";
import { KalturaViewMode } from "kaltura-typescript-client/types/KalturaViewMode";

@Pipe({
  name: 'streamStatus'
})
export class StreamStatusPipe implements PipeTransform {

  transform(entryServerNodeStatus: KalturaEntryServerNodeStatus, viewMode = KalturaViewMode.allowAll): 'Live' | 'Initializing' | 'Offline' | 'Preview' {
    switch (entryServerNodeStatus) {
      case KalturaEntryServerNodeStatus.authenticated:
      case KalturaEntryServerNodeStatus.broadcasting:
        return 'Initializing';
      case KalturaEntryServerNodeStatus.playable:
        return (viewMode === KalturaViewMode.preview) ? 'Preview' : 'Live';
      case KalturaEntryServerNodeStatus.stopped:
      default:
        return 'Offline'
    }
  }

}
