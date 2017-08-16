import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import Duration = moment.Duration;
import {TranslateService} from "ng2-translate";

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform{

  constructor(private _translate: TranslateService){}

  transform(duration: Duration) : string {
    let timeString = '00:00:00';

    if (duration){
      if (duration.months() > 0){
        timeString = this._translate.instant('STREAM_CONFIG.stream_duration_in_months', {months: duration.months(), days: duration.days()})
      }
      else if (duration.days() > 0){
        timeString = this._translate.instant('STREAM_CONFIG.stream_duration_in_days', {days: duration.days(), hours: duration.hours()})
      }
      else{
        timeString = this.padTo2Digits(duration.hours()) + ':' +  this.padTo2Digits(duration.minutes()) + ':' + this.padTo2Digits(duration.seconds());
      }
    }

    return timeString;
  }

  private padTo2Digits(number: number) {
    return ((0 <= number && number < 10) ? '0' : '') + number;
  }
}
