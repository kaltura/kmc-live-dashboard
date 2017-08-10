/*
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import 'rxjs/Rx';

@Injectable()
export class KalturaApiService {

  _serviceUrl: string = "http://10.0.80.11";
  _id: number = 0;
  _ks: string = 'ODFkZjUzZDQ5YzZhNDM0MDg4ZTJiODdhY2MwYmIzNzJmMTVkMWZiNnwxMDI7MTAyOzE0OTU3MDQyODY7MjsxNDkzMTEyMjg2LjY0MjI7Ozs7';

  constructor(private http: Http) {
    // Observable.timer(1000).subscribe( ()=> {
    //   isLive()
    // })
  }

  // public getEntry(entryId: string): Observable<LiveStreamEntry> {
  //
  //   return this.apiRequest(
  //     {
  //       service: 'livestream',
  //       action: 'get',
  //       entryId: entryId
  //     })
  //     .map(res => {
  //       return res as LiveStreamEntry;
  //     });
  // }
  //
  // public updateEntry(entry: LiveStreamEntry): Observable<LiveStreamEntry> {
  //
  //   return this.apiRequest(
  //     {
  //       service: 'livestream',
  //       action: 'update',
  //       entryId: entry.id,
  //       'liveStreamEntry:objectType': 'KalturaLiveStreamEntry',
  //       'liveStreamEntry:name':entry.name,
  //       'liveStreamEntry:description':entry.description,
  //       'liveStreamEntry:conversionProfileId':entry.conversionProfileId,
  //       'liveStreamEntry:recordStatus':entry.recordStatus
  //     })
  //     .map(res => {
  //       return res as LiveStreamEntry;
  //     });
  // }

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
    })
      .map((response: Response) => {
        let result = response.json();
        let headers = response.headers;
        //this.logger.info('API response for '+this._id+' X-Me: '+headers.get('X-Me')+ ' X-Kaltura-Session: '+ headers.get('X-Kaltura-Session')+ ' X-Kaltura: '+ headers.get('X-Kaltura'));
        if (result && result.objectType === "KalturaAPIException") {
          throw new Error(result.message);
        }
        return result;
      })
  }
}
*/
