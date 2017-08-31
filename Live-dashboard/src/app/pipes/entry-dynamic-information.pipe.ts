import { Pipe, PipeTransform } from '@angular/core';
import { isBoolean } from "util";

@Pipe({
  name: 'entryDynamicInformation'
})
export class EntryDynamicInformationPipe implements PipeTransform {

  transform(value: boolean, arg?: string): string {
    if (isBoolean(value)) {
      if (value) {
        return 'On';
      }
      else if (arg !== 'Offline') {
        return 'Off';
      }
      return 'N/A';
    }
  }

}
