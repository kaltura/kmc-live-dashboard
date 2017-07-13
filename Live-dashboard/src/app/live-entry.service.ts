// General
import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { ISubscription } from "rxjs/Subscription";
import * as _ from 'lodash';
import { isUndefined } from "util";
// Services
import { KalturaClient } from "@kaltura-ng/kaltura-client";
import { LiveEntryTimerTaskService } from "./entry-timer-task.service";
import { ConversionProfileService } from "./conversion-profile.service";
// Kaltura objects and types
import { LiveStreamGetAction } from "kaltura-typescript-client/types/LiveStreamGetAction";
import { KalturaLiveStreamEntry } from "kaltura-typescript-client/types/KalturaLiveStreamEntry";
import { LiveStreamUpdateAction } from "kaltura-typescript-client/types/LiveStreamUpdateAction";
import { EntryServerNodeListAction } from "kaltura-typescript-client/types/EntryServerNodeListAction";
import { KalturaEntryServerNodeFilter } from "kaltura-typescript-client/types/KalturaEntryServerNodeFilter";
import { KalturaEntryServerNode } from "kaltura-typescript-client/types/KalturaEntryServerNode";
import { KalturaAssetParamsOrigin } from "kaltura-typescript-client/types/KalturaAssetParamsOrigin";
import { KalturaDVRStatus } from "kaltura-typescript-client/types/KalturaDVRStatus";
import { KalturaRecordStatus } from "kaltura-typescript-client/types/KalturaRecordStatus";
import { KalturaEntryServerNodeStatus } from "kaltura-typescript-client/types/KalturaEntryServerNodeStatus";


export interface StreamStatus {
  status: 'initial' | 'loading' | 'loaded' | 'error';
  error?: Error;
}

export enum LiveStreamStatusEnum {
  Offline,
  Broadcasting,
  Live
}

export interface LiveEntryStaticConfiguration {
  dvr?: boolean,
  recording?: boolean,
  transcoding?: boolean,
}

export interface LiveEntryDynamicConfiguration {
  redundancy?: boolean,
  streamHealth?: boolean, // TODO create StreamHealth type
  streamStatus?: LiveStreamStatusEnum;
}

@Injectable()
export class LiveEntryService {
  // TODO:
  //  id: string = '0_o3v14r0z'; // nothing passthrough
  id: string = '0_objn1w04'; // nothing cloudtranscode
  // id: string = '0_yl7e56ym'; // Dvr
  // id: string = '0_2m4p0bm1'; // Recording append
  // id: string = '0_qsjnf3kk'; // Recording new
  // id: string ='0_7qtj5v0m';
  //
  // BehaviorSubject subscribed by application
  private _applicationStatus = new BehaviorSubject<StreamStatus>({status : 'initial'});
  public applicationStatus$ = this._applicationStatus.asObservable();
  // BehaviorSubjects subscribed settings components for manipulation
  private _liveStream = new BehaviorSubject<KalturaLiveStreamEntry>(null);
  public liveStream$ = this._liveStream.asObservable();
  private _cachedLiveStream: KalturaLiveStreamEntry;
  // BehaviorSubjects subscribed configuration display component
  private _entryStaticConfiguration = new BehaviorSubject<LiveEntryStaticConfiguration>(null);
  public entryStaticConfiguration$ = this._entryStaticConfiguration.asObservable();
  private _entryDynamicConfiguration = new BehaviorSubject<LiveEntryDynamicConfiguration>(null);
  public entryDynmicConfiguration$ = this._entryDynamicConfiguration.asObservable();

  private _pullRequestEntryStatusMonitoring: ISubscription;
  private _propertiesToUpdate = ['name', 'description', 'conversionProfileId', 'dvrStatus', 'recordStatus'];

  constructor(private _kalturaClient: KalturaClient, private _entryTimerTask: LiveEntryTimerTaskService, private _conversionProfilesService: ConversionProfileService) { }

  ngOnDestroy() {
    this._applicationStatus.unsubscribe();
    this._liveStream.unsubscribe();
    this._entryStaticConfiguration.unsubscribe();
    this._pullRequestEntryStatusMonitoring.unsubscribe();
  }

  public getLiveEntryInformation(): void {
    this._getLiveStream();
  }

  private _getLiveStream(): void {
    this._applicationStatus.next({ status: 'loading' });
    this._kalturaClient.request(new LiveStreamGetAction ({ entryId : this.id }))
      .subscribe(response => {
        this._cachedLiveStream = JSON.parse(JSON.stringify(response));
        this._liveStream.next(response);
        this._parseEntryConfiguration(response);
      },
      error => {
        this._applicationStatus.next({
          status: 'error',
          error: error
        });
        console.log(this._applicationStatus.value);
      });
  }

  private _parseEntryConfiguration(liveEntryObj: KalturaLiveStreamEntry): void {
    let entryConfig: LiveEntryStaticConfiguration = {};
    this._conversionProfilesService.getConversionProfileFlavors(liveEntryObj.conversionProfileId)
      .subscribe(result => {
        entryConfig.dvr = (liveEntryObj.dvrStatus === KalturaDVRStatus.enabled);
        entryConfig.recording = (liveEntryObj.recordStatus !== KalturaRecordStatus.disabled);
        // Look through the array and find the first flavor that is transcoded
        let isTranscodedFlavor = result.objects.find(f => { return f.origin ===  KalturaAssetParamsOrigin.convert });
        entryConfig.transcoding = !isUndefined(isTranscodedFlavor);

        this._entryStaticConfiguration.next(entryConfig);
      })
  }

  /*private _parseEntryConfigurations(apiLiveStreamEntry: KalturaLiveStreamEntry): LiveEntryConfiguration {
    function getUrls(): EncoderUrls {
      return {
        rtmp: {
          primary: apiLiveStreamEntry.primaryBroadcastingUrl,
          backup: apiLiveStreamEntry.secondaryBroadcastingUrl
        },
        rtsp: {
          primary: apiLiveStreamEntry.primaryRtspBroadcastingUrl,
          backup: apiLiveStreamEntry.secondaryRtspBroadcastingUrl
        }
      }
    }

    return {
      name: apiLiveStreamEntry.name,
      description: apiLiveStreamEntry.description,
      conversionProfileId: apiLiveStreamEntry.conversionProfileId,
      encoderUrls: getUrls(),
      streamName: apiLiveStreamEntry.streamName,
      dvr: apiLiveStreamEntry.dvrStatus
    }
  }*/

  public runEntryStatusMonitoring(): void {
    this._pullRequestEntryStatusMonitoring = this._entryTimerTask.runTimer(() => {
        return this._kalturaClient.request(new EntryServerNodeListAction({
          filter: new KalturaEntryServerNodeFilter({entryIdEqual: this.id})
        })).map(response => {
          let x: LiveEntryDynamicConfiguration = this._parseEntryServeNodeList(response.objects);
          this._entryDynamicConfiguration.next(x);
          return;
        });
    }, 3000)
      .subscribe(response => {
        if (response.status === 'timeout') {
          // show network connectivity issue
        }
      });
  }

  private _parseEntryServeNodeList(snList: KalturaEntryServerNode[]): LiveEntryDynamicConfiguration {
    function getStreamStatus(): LiveStreamStatusEnum {
      // Check stream status by order:
      // (1) If one serverNode is Playable -> Live
      // (2) If one serverNode is Broadcasting -> Initializing
      // (3) Just return the first status (Stopped or Authenticated) - Offline
      let isPlaying = snList.find(sn => { return sn.status === KalturaEntryServerNodeStatus.playable; });
      if (!isUndefined(isPlaying)) {
        return LiveStreamStatusEnum.Live;
      }
      let isBroadcasting = snList.find(sn => { return sn.status === KalturaEntryServerNodeStatus.broadcasting; });
      if (!isUndefined(isBroadcasting)) {
        return LiveStreamStatusEnum.Broadcasting;
      }

      return LiveStreamStatusEnum.Offline;
    }
    let dynamicConfigObj: LiveEntryDynamicConfiguration = {};
    // Check redundancy if more than one serverNode was returned
    dynamicConfigObj.redundancy = (snList.length > 1);
    dynamicConfigObj.streamStatus = getStreamStatus();

    return dynamicConfigObj;
  }

  public saveLiveStreamEntry(): void {
    let diffProperties = _.filter(this._propertiesToUpdate, (p) => {
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
        this._cachedLiveStream = JSON.parse(JSON.stringify(response));
      });
  }
}
