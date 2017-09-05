import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'entryBooleanConfiguration'
})
export class EntryBooleanConfigurationPipe implements PipeTransform {

  transform(value: boolean): 'On' | 'Off' {
    return value ? 'On' : 'Off';
  }

}
