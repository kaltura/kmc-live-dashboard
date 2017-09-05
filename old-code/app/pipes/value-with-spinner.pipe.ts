import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'valueWithSpinner'})
export class ValueWithSpinnerPipe implements PipeTransform {
  transform(value = null):string {
    if (value === null) {
      return '<i class="fa fa-spinner fa-spin  fa-fw"></i>';
    }
    return `${value}`;
  }
}
