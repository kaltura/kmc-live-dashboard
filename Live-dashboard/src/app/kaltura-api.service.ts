import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import 'rxjs/Rx';
import { LiveDashboardConfiguration } from "./services/live-dashboard-configuration.service";

@Injectable()
export class KalturaApiService {

  private _serviceUrl: string;
  private _id: number = 0;
  private _ks: string;

  constructor(private http: Http, private _liveDashboardConfiguration: LiveDashboardConfiguration) {
    this._ks = this._liveDashboardConfiguration.ks;
    this._serviceUrl = this._liveDashboardConfiguration.service_url;
  }

  public apiRequest(requests: any): Observable<any> {
    let body: any = {
      ks: this._ks,
      format: 1
    };

    if (_.isArray(requests)) {
      body['service'] = "multirequest";
      requests.forEach((item, index) => {
        _.each(item, (value, key) => {
          body[index + ":" + key] = value;
        });
      });
    }
    else {
      body = _.assign(body, requests);
    }

    this._id++;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    ///headers.append('Access-Control-Expose-Headers', 'X-Me');

    //  this.logger.info('API request '+this._id+' '+JSON.stringify(body));

    return this.http.post(this._serviceUrl + `/api_v3/index.php`, JSON.stringify(body), {
      headers: headers
    });
  }
}
