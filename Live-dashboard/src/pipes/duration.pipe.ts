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
      if (duration.days() > 0){
        timeString = `x Days, y Hours`;    //todo !!!!!
        //timeString = this._translate.get('')
      }
      else if (duration.months() > 0){
        timeString = `x Months, y Days`;
      }
      else{
        timeString = this.padTo2Digits(duration.hours()) + ':' +  this.padTo2Digits(duration.minutes()) + ':' + this.padTo2Digits(duration.seconds());
      }
    }

    return timeString;
  }

  private padTo2Digits(number: number) {
    return (number < 10 ? '0' : '') + number;
  }
}
