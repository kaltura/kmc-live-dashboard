import { Pipe, PipeTransform } from '@angular/core';
import { LiveStreamStatusEnum } from "../app/live-entry.service";
import { isBoolean } from "util";

@Pipe({
  name: 'entryDynamicInformation'
})
export class EntryDynamicInformationPipe implements PipeTransform {

  transform(value: boolean | LiveStreamStatusEnum, arg?: LiveStreamStatusEnum): string {
    if (isBoolean(value)) {
      if (value) {
        return 'On';
      }
      else if (arg !== LiveStreamStatusEnum.Offline) {
        return 'Off';
      }
      return 'N/A';
    }

    switch (value) {
      case LiveStreamStatusEnum.Live:
        return 'Live';
      case LiveStreamStatusEnum.Broadcasting:
        return 'Initializing';
      default:
        return 'Offline';
    }
  }

}
