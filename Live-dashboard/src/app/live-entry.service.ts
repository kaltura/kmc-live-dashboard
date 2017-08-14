// General
import { Injectable, Input } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { ISubscription } from "rxjs/Subscription";
import * as _ from 'lodash';
import * as moment from 'moment';
import { isUndefined } from "util";
// Services and Configuration
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
import { KalturaLiveStreamAdminEntry } from "kaltura-typescript-client/types/KalturaLiveStreamAdminEntry";
import { KalturaLiveEntryServerNode } from "kaltura-typescript-client/types/KalturaLiveEntryServerNode";
import { LiveDashboardConfiguration } from "./services/live-dashboard-configuration.service";
import { KalturaLiveStreamParams } from "kaltura-typescript-client/types/KalturaLiveStreamParams";

export interface StreamStatus {
  status: 'initial' | 'loading' | 'loaded' | 'error';
  error?: Error;
}

export enum LiveStreamStatusEnum {
  Offline,
  Broadcasting,
  Live
}

export enum ServerType {
  Primary = 0,
  Secondary = 1
}

export interface LiveEntryStaticConfiguration {
  dvr?: boolean,
  recording?: boolean,
  transcoding?: boolean,
}

export interface LiveEntryDynamicStreamInfo {
  redundancy?: boolean,
  streamHealth?: boolean, // TODO create StreamHealth type
  streamStatus?: LiveStreamStatusEnum,
  streamStartTime?: number
  allStreams?: NodeStreams
  streamCreationTime?: number
}

export class NodeStreams{
  primary: KalturaLiveStreamParams[];
  secondary: KalturaLiveStreamParams[];
}

@Injectable()
export class LiveEntryService {
  id: string;
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
  private _entryDynamicConfiguration = new BehaviorSubject<LiveEntryDynamicStreamInfo>(null);
  public entryDynamicConfiguration$ = this._entryDynamicConfiguration.asObservable();

  private _pullRequestEntryStatusMonitoring: ISubscription;
  private _propertiesToUpdate = ['name', 'description', 'conversionProfileId', 'dvrStatus', 'recordStatus'];

  constructor(private _kalturaClient: KalturaClient,
              private _entryTimerTask: LiveEntryTimerTaskService,
              private _conversionProfilesService: ConversionProfileService,
              private _liveDashboardConfiguration: LiveDashboardConfiguration) {

    this.id = this._liveDashboardConfiguration.entryId;
  }

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
    this._kalturaClient.request(new LiveStreamGetAction ({ entryId : this.id, acceptedTypes : [KalturaLiveStreamAdminEntry, KalturaLiveEntryServerNode] }))
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
      }))
      .map(response => {
        this._entryDynamicConfiguration.next(this._parseEntryServeNodeList(response.objects));
        return;
      });
    }, 1000)
      .subscribe(response => {
        if (response.status === 'timeout') {
          // show network connectivity issue
        }
      });
  }

  private _parseEntryServeNodeList(snList: KalturaEntryServerNode[]): LiveEntryDynamicStreamInfo {
    let dynamicConfigObj: LiveEntryDynamicStreamInfo = {};

    // Initialize streamStartTime
    dynamicConfigObj.streamStartTime = 0;

    // Check stream status by order:
    // (1) If one serverNode is Playable -> Live
    // (2) If one serverNode is Broadcasting -> Broadcasting
    // (3) Any other state -> Offline
    let playingServerNode = snList.find(sn => { return sn.status === KalturaEntryServerNodeStatus.playable; });
    if (!isUndefined(playingServerNode)) {
      dynamicConfigObj.streamStatus = LiveStreamStatusEnum.Live;
    }
    else {
      let isBroadcasting = snList.find(sn => { return (sn.status === KalturaEntryServerNodeStatus.broadcasting); });
      if (!isUndefined(isBroadcasting)) {
        dynamicConfigObj.streamStatus = LiveStreamStatusEnum.Broadcasting;
        dynamicConfigObj.streamStartTime = Date.now();
      }
      else {
        dynamicConfigObj.streamStatus = LiveStreamStatusEnum.Offline;
      }
    }

    // init redundancy default value
    dynamicConfigObj.redundancy = false;

    if (snList.length > 1){
      dynamicConfigObj.redundancy = true;   // redundancy on if more than one serverNode was returned
      dynamicConfigObj.streamCreationTime = snList[0].createdAt ? snList[0].createdAt.valueOf() : null;
    }

    dynamicConfigObj.allStreams = new NodeStreams();
    snList.forEach((eServerNode) =>{
      // get all stream avaiable (primary, secondary)
      if(eServerNode.serverType.toString() === ServerType.Primary.toString()){
        dynamicConfigObj.allStreams.primary = (<KalturaLiveEntryServerNode> eServerNode).streams;
      }
      else if(eServerNode.serverType.toString() === ServerType.Secondary.toString()){
        dynamicConfigObj.allStreams.secondary = (<KalturaLiveEntryServerNode> eServerNode).streams;
      }

      // get the earlier eServerNode.createdAt time available
      if (moment(eServerNode.createdAt).isBefore(dynamicConfigObj.streamCreationTime)){
        dynamicConfigObj.streamCreationTime = eServerNode.createdAt? eServerNode.createdAt.valueOf() : null;
      }
    });

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
