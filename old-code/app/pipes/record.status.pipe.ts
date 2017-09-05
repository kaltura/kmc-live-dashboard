import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'recordStatus'})
export class RecordStatusPipe implements PipeTransform {
  transform(value = '0'): string {
    let recordStatus = '';
    switch (value.toString()) {
      case '0':
        recordStatus = 'Disabled';
        break;
      case '1':
        recordStatus = 'Append';
        break;
      default:
        recordStatus = 'Create';
        break;
    }
    return recordStatus;
  }
}
