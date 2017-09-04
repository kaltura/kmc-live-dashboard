import { Pipe, PipeTransform } from '@angular/core';
import { KalturaMediaType } from "kaltura-typescript-client/types/KalturaMediaType";

@Pipe({
  name: 'entryType'
})
export class EntryTypePipe implements PipeTransform {

  transform(value: KalturaMediaType): string {
    let entryType: string = "";
    switch (value) {
      case KalturaMediaType.audio:
        entryType = "Audio";
        break;
      case KalturaMediaType.video:
        entryType = "Video";
        break;
      case KalturaMediaType.image:
        entryType = "Image";
        break;
      case KalturaMediaType.liveStreamFlash:
      case KalturaMediaType.liveStreamQuicktime:
      case KalturaMediaType.liveStreamRealMedia:
      case KalturaMediaType.liveStreamWindowsMedia:
        entryType = "Live";
        break;
      default:
        entryType = "Unknown";
        break;
    }

    return entryType;
  }

}
