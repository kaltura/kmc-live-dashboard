import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import {LiveDashboardConfiguration} from "../services/live-dashboard-configuration.service";

@Pipe({
  name: 'localeTime'
})
export class LocaleTimePipe implements PipeTransform {

  constructor(private _liveDashboardConfiguration: LiveDashboardConfiguration) {}

  transform(seconds: number): string
  {
    let time = moment(seconds).locale(this._liveDashboardConfiguration.lang).format('ddd, ll LT');

    return time;
  }
}
