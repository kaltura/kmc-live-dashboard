import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import {LiveDashboardConfiguration} from "../services/live-dashboard-configuration.service";

@Pipe({
  name: 'localeTime'
})
export class LocaleTimePipe implements PipeTransform {

  constructor(private _liveDashboardConfiguration: LiveDashboardConfiguration) {}

  transform(time: number, longFormat?: boolean): string {
    if (longFormat) {
      return moment(time).locale(this._liveDashboardConfiguration.lang).format('ll LT');
    }

    return moment(time).locale(this._liveDashboardConfiguration.lang).format('l LT');
  }
}
