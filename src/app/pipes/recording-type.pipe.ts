import { Pipe, PipeTransform } from '@angular/core';
import { KalturaRecordStatus } from "kaltura-ngx-client/api/types/KalturaRecordStatus";

@Pipe({
  name: 'recordingType'
})
export class RecordingTypePipe implements PipeTransform {

  transform(value: KalturaRecordStatus): string {
    switch (value) {
      case KalturaRecordStatus.disabled:
        return "";
      case KalturaRecordStatus.appended:
        return 'appendRecording';
      case KalturaRecordStatus.perSession:
        return 'newEntryPerSession';
    }
  }

}
