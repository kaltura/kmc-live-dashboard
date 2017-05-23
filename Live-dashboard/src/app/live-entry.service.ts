import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

import { KalturaClientConfiguration, KalturaClient } from "@kaltura-ng/kaltura-client";
import { LiveStreamGetAction } from "kaltura-typescript-client/types/LiveStreamGetAction";
import { KalturaLiveStreamEntry } from "kaltura-typescript-client/types/KalturaLiveStreamEntry";
import { LiveStreamUpdateAction } from "kaltura-typescript-client/types/LiveStreamUpdateAction";
import * as _ from 'lodash';

export interface StreamStatus {
  status: 'initial' | 'loading' | 'loaded' | 'error';
  error?: Error;
}

@Injectable()
export class LiveEntryService {
  // TODO:
  //id: string = '0_objn1w04'; // nothing
  // id: string = '0_yl7e56ym'; // Dvr
  id: string = '0_2m4p0bm1'; // Recording append
  // id: string = '0_qsjnf3kk'; // Recording new
  //
  private _streamStatus = new BehaviorSubject<StreamStatus>({status : 'initial'});
  public streamStatus$ = this._streamStatus.asObservable();
  private _liveStream = new BehaviorSubject<KalturaLiveStreamEntry>(null);
  public liveStream$ = this._liveStream.asObservable();
  private _cachedLiveStream: KalturaLiveStreamEntry;
  private _propertiestoUpdate = ['name', 'description', 'conversionProfileId', 'dvrStatus', 'recordStatus'];

  constructor(private _kalturaClient: KalturaClient, private _kalturaClientConfig: KalturaClientConfiguration) {
    _kalturaClientConfig.ks = 'ODFkZjUzZDQ5YzZhNDM0MDg4ZTJiODdhY2MwYmIzNzJmMTVkMWZiNnwxMDI7MTAyOzE0OTU3MDQyODY7MjsxNDkzMTEyMjg2LjY0MjI7Ozs7';
    _kalturaClientConfig.clientTag = 'KalturaLiveDashboard';
    _kalturaClientConfig.endpointUrl = 'http://10.0.80.11/api_v3/index.php';
  }

  public getStreamInfo(): void {
    // TODO: Should I create an instance for unsubscribe?
    this._streamStatus.next({ status: 'loading' });
    this._kalturaClient.request(new LiveStreamGetAction({ entryId : this.id }))
      .subscribe(response => {
        this._cachedLiveStream = JSON.parse(JSON.stringify(response));
        this._liveStream.next(response);
      },
      error => {
        this._streamStatus.next({
          status: 'error',
          error: error
        });
      }
    );
  }

  public saveLiveStreamEntry(): void {
    let diffProperties = _.filter(this._propertiestoUpdate, (p) => {
      return (this._liveStream.value[p] !== this._cachedLiveStream[p]);
    });
    let liveStreamArgument = new KalturaLiveStreamEntry();
    for (let property of diffProperties) {
      liveStreamArgument[property] = this._liveStream.value[property];
    }
    this._kalturaClient.request(new LiveStreamUpdateAction({
      entryId: this.id,
      liveStreamEntry: liveStreamArgument
    }))
      .subscribe(response => {
        this._liveStream.next(response);
      });
  }

  /*private update(key: string, value: any): Observable<LiveStreamEntry> {
    return this.apiRequest(
      {
        service: 'livestream',
        action: 'update',
        entryId: entry.id,
        'liveStreamEntry:objectType': 'KalturaLiveStreamEntry',
        `liveStreamEntry:${key}`: value
      })
    .map(res => {
      return res as LiveStreamEntry;
    });
  }*/
}
