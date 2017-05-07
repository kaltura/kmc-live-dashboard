import { Injectable } from '@angular/core';
import { KalturaApiService } from './kaltura-api.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from "rxjs";
//import { KalturaAPIException } from '@kaltura-ng2/kaltura-api/types';

import 'rxjs/add/operator/map';
import * as _ from 'lodash';

interface StreamInfo {
  name: string;
  description: string;
  recordingStatus: number;
  dvrStatus: boolean;
  conversionProfileId: number;
  encoderSettings: EncoderSettings;
}

interface EncoderSettings {
  primaryUrl: string;
  secondaryUrl: string;
  stream: string;
}

declare type ConversionProfile = {
  id: string;
  name: string;
}

declare type StreamStatus = {
  status: 'initial' | 'loading' | 'loaded' | 'error';
  error?: Error;
}

@Injectable()
export class LiveEntryService {
  // TODO:
  //id: string = '0_objn1w04'; // nothing
  //id: string = '0_yl7e56ym'; // Dvr
  id: string = '0_2m4p0bm1'; // Recording append
  //id: string = '0_qsjnf3kk'; // Recording new
  //
  private _streamStatus = new BehaviorSubject<StreamStatus>({status : 'initial'});
  public streamStatus$ = this._streamStatus.asObservable();
  private _streamInfo = new BehaviorSubject<StreamInfo>(null);
  public streamInfo$ = this._streamInfo.asObservable();

  constructor(private _apiServer: KalturaApiService) { }

  public getStreamInfo(): void {
    // TODO: Should I create an instance for unsubscribe?
    this._streamStatus.next({ status: 'loading' });
    this._apiServer.apiRequest({
      service: 'livestream',
      action: 'get',
      entryId: this.id
    })
    .subscribe(result => {
      /*if (result instanceof KalturaApiException) {
        this._streamStatus.next({
          status: 'error',
          error: new Error(`API returned an exception!`)
        });
      }
      else {
        let streamInfo = this.createStreamInfo(result);
        this._streamInfo.next(streamInfo);
      }*/
      this._streamInfo.next(this.createStreamInfo(result));
      this._streamStatus.next({ status: 'loaded' });
    },
      error => {
        this._streamStatus.next({
          status: 'error',
          error: error
        });
      });
  }

  // TODO: What does it means 'static' function in TypeScript?
  private createStreamInfo(info): StreamInfo {
    return {
      name: info.name,
      description: info.description,
      recordingStatus: info.recordStatus,
      dvrStatus: info.dvrStatus,
      conversionProfileId: info.conversionProfileId,
      encoderSettings: {
        primaryUrl : info.primaryBroadcastingUrl,
        secondaryUrl : info.secondaryBroadcastingUrl,
        // API result doesn't contain the stream name with the correct suffix.
        stream: info.id + '_1'
      }
    }
  }

  public getConversionProfiles(): Observable<ConversionProfile[]> {
    return this._apiServer.apiRequest({
      service: 'conversionprofile',
      action: 'list',
      'filter:objectType': 'KalturaConversionProfileFilter',
      'filter:typeEqual': 2
    })
      .map(result => {
        return _.map(result.objects, (cp) => {
          return { id: cp.id, name: cp.name }
        });
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
