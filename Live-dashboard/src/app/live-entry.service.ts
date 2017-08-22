// General
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { ISubscription } from "rxjs/Subscription";
import * as _ from 'lodash';
import * as moment from 'moment';

// Services and Configuration
import { KalturaClient } from "@kaltura-ng/kaltura-client";
import { LiveEntryTimerTaskService } from "./entry-timer-task.service";
import { ConversionProfileService } from "./conversion-profile.service";
import { LiveDashboardConfiguration } from "./services/live-dashboard-configuration.service";
import { environment } from "../environments/environment";
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
import { KalturaLiveStreamParams } from "kaltura-typescript-client/types/KalturaLiveStreamParams";
import { KalturaEntryServerNodeType } from "kaltura-typescript-client/types/KalturaEntryServerNodeType";
import { BeaconGetLastAction } from "kaltura-typescript-client/types/BeaconGetLastAction";
import { KalturaBeaconFilter } from "kaltura-typescript-client/types/KalturaBeaconFilter";
import { KalturaBeacon } from "kaltura-typescript-client/types/KalturaBeacon";
import {LiveReportsGetEventsAction} from "kaltura-typescript-client/types/LiveReportsGetEventsAction";
import {KalturaLiveReportType} from "kaltura-typescript-client/types/KalturaLiveReportType";
import {KalturaLiveReportInputFilter} from "kaltura-typescript-client/types/KalturaLiveReportInputFilter";
import {KalturaNullableBoolean} from "kaltura-typescript-client/types/KalturaNullableBoolean";

export interface ApplicationStatus {
  streamStatus: LoadingStatus,
  streamHealth: LoadingStatus,
  liveEntry: LoadingStatus
}

export enum LoadingStatus {
  initializing,
  failed,
  succeeded
}

export interface LiveEntryDiagnosticsInfo {
  staticInfo?: { updatedTime?: number, data?: Object },
  dynamicInfo?: { updatedTime?: number, data?: Object },
  streamHealth: {
    updatedTime?: number,
    health?: 'Good' | 'Fair' | 'Poor',
    alerts?: Object[]
  }
}

export interface LiveEntryStaticConfiguration {
  dvr?: boolean,
  recording?: boolean,
  transcoding?: boolean,
}

export interface LiveEntryDynamicStreamInfo {
  redundancy?: boolean,
  streamStatus?: 'Live' | 'Initializing' | 'Offline',
  allStreams?: NodeStreams
  streamCreationTime?: number
}

export class NodeStreams{
  primary: KalturaLiveStreamParams[];
  secondary: KalturaLiveStreamParams[];
}

@Injectable()
export class LiveEntryService{

  private _id: string;
  // BehaviorSubject subscribed by application
  private _applicationStatus = new BehaviorSubject<ApplicationStatus>({
    streamStatus: LoadingStatus.initializing,
    streamHealth: LoadingStatus.initializing,
    liveEntry: LoadingStatus.initializing
  });
  public applicationStatus$ = this._applicationStatus.asObservable();
  // BehaviorSubjects subscribed by settings components for manipulation
  private _liveStream = new BehaviorSubject<KalturaLiveStreamEntry>(null);
  public liveStream$ = this._liveStream.asObservable();
  private _cachedLiveStream: KalturaLiveStreamEntry;
  // BehaviorSubjects subscribed by configuration display component for status monitoring
  private _entryStaticConfiguration = new BehaviorSubject<LiveEntryStaticConfiguration>(null);
  public entryStaticConfiguration$ = this._entryStaticConfiguration.asObservable();
  private _entryDynamicInformation = new BehaviorSubject<LiveEntryDynamicStreamInfo>(null);
  public entryDynamicInformation$ = this._entryDynamicInformation.asObservable();
  // BehaviorSubjects subscribed by configuration display component for diagnostics and health monitoring
  private _entryDiagnosticsInfo: LiveEntryDiagnosticsInfo = {
    staticInfo: { updatedTime: 0 },
    dynamicInfo: { updatedTime: 0 },
    streamHealth: { updatedTime: 0, health: 'Good' }
  };
  private _entryDiagnostics = new BehaviorSubject<LiveEntryDiagnosticsInfo>(this._entryDiagnosticsInfo);
  public entryDiagnostics$ = this._entryDiagnostics.asObservable();

  private _pullRequestEntryStatusMonitoring: ISubscription;
  private _pullRequestStreamHealthMonitoring: ISubscription;

  private _propertiesToUpdate = ['name', 'description', 'conversionProfileId', 'dvrStatus', 'recordStatus'];
  private _numOfWatchersTimerSubscription: Subscription = null;

  private _numOfWatcherSubject = new BehaviorSubject<any>(null);
  public numOfWatcher$ = this._numOfWatcherSubject.asObservable();


  constructor(private _kalturaClient: KalturaClient,
              private _entryTimerTask: LiveEntryTimerTaskService,
              private _conversionProfilesService: ConversionProfileService,
              private _liveDashboardConfiguration: LiveDashboardConfiguration) {

    this._id = this._liveDashboardConfiguration.entryId;
    this.listenToNumOfWatcherWhenLive();
  }

  private listenToNumOfWatcherWhenLive() {
    // init the timer
    let numOfWatcherTimer$ = this._entryTimerTask.runTimer(() => {
        return this._getNumOfWatchers();
      },
      environment.liveEntryService.liveAnalyticsIntervalTimeInMs
    );

    // On Live  -> Subscribe (get api call of num of watchers)
    // Else     -> Unsubscribe
    this._entryDynamicInformation.subscribe((dynamicInfo) => {
      if (dynamicInfo && dynamicInfo.streamStatus === 'Live' && this._numOfWatchersTimerSubscription === null) {
        this._numOfWatchersTimerSubscription = numOfWatcherTimer$.subscribe((response) => {
          if (response['status'] === 'timeout') {
            console.log('Live Entry: Error at getNumOfWatchers request.')
          }
        });
      }
      else if (this._numOfWatchersTimerSubscription) {
        this._numOfWatchersTimerSubscription.unsubscribe();
        this._numOfWatchersTimerSubscription = null;
      }
    });
  }

  ngOnDestroy() {
    this._liveStream.unsubscribe();
    this._entryStaticConfiguration.unsubscribe();
    this._entryDynamicInformation.unsubscribe();
    this._pullRequestEntryStatusMonitoring.unsubscribe();
    this._pullRequestStreamHealthMonitoring.unsubscribe();

    if (this._numOfWatchersTimerSubscription) {
      this._numOfWatchersTimerSubscription.unsubscribe();
      this._numOfWatchersTimerSubscription = null;
    }
  }

  public InitiateLiveEntryService(): void {
    this._getLiveStream();
    this._runEntryStatusMonitoring();
    this._runStreamHealthMonitoring();
  }

  private _updatedApplicationStatus(key: string, value: LoadingStatus): void {
    const newAppStatus = this._applicationStatus.getValue();

    if (newAppStatus[key] !== LoadingStatus.initializing)
      return;

    switch (key) {
      case 'streamStatus':
        newAppStatus.streamStatus = value;
        console.log(`Stream status is: ${value}`);
        break;
      case 'streamHealth':
        newAppStatus.streamHealth = value;
        console.log(`Stream health is: ${value}`);
        break;
      case 'liveEntry':
        newAppStatus.liveEntry = value;
        console.log(`Live entry is: ${value}`);
        break;
    }

    this._applicationStatus.next(newAppStatus);
  }

  private _getLiveStream(): void {
    this._kalturaClient.request(new LiveStreamGetAction({
        entryId : this._id,
        acceptedTypes : [KalturaLiveStreamAdminEntry, KalturaLiveEntryServerNode]
      }))
      .subscribe(response => {
        this._cachedLiveStream = JSON.parse(JSON.stringify(response));
        this._liveStream.next(response);
        this._parseEntryConfiguration(response);
      });
  }

  private _parseEntryConfiguration(liveEntryObj: KalturaLiveStreamEntry): void {
    let entryConfig: LiveEntryStaticConfiguration = {};
    this._conversionProfilesService.getConversionProfileFlavors(liveEntryObj.conversionProfileId)
      .subscribe(response => {
        entryConfig.dvr = (liveEntryObj.dvrStatus === KalturaDVRStatus.enabled);
        entryConfig.recording = (liveEntryObj.recordStatus !== KalturaRecordStatus.disabled);
        // Look through the array and find the first flavor that is transcoded
        let isTranscodedFlavor = response.objects.find(f => { return f.origin ===  KalturaAssetParamsOrigin.convert });
        entryConfig.transcoding = isTranscodedFlavor ? true : false;
        this._entryStaticConfiguration.next(entryConfig);
        this._updatedApplicationStatus('liveEntry', LoadingStatus.succeeded);
      });
  }

  private _runEntryStatusMonitoring(): void {
    this._pullRequestEntryStatusMonitoring = this._entryTimerTask.runTimer(() => {
      return this._kalturaClient.request(new EntryServerNodeListAction({
        filter: new KalturaEntryServerNodeFilter({entryIdEqual: this._id})
      }))
        .do(response => {
          let dynamicInfo = this._parseEntryServeNodeList(response.objects);
          this._entryDynamicInformation.next(dynamicInfo);
          this._updatedApplicationStatus('streamStatus', LoadingStatus.succeeded);
          return;
        })
        .catch((err,caught) => {
            this._updatedApplicationStatus('streamStatus', LoadingStatus.failed);
            return caught;
          }
        );
    }, environment.liveEntryService.streamStatusIntervalTimeInMs)
      .subscribe(response => {
        if (response.errorType === 'timeout') {
          // TODO: show network connectivity issue!!!
        }
      });
  }

  private _parseEntryServeNodeList(snList: KalturaEntryServerNode[]): LiveEntryDynamicStreamInfo {
    let dynamicConfigObj: LiveEntryDynamicStreamInfo = {};
    dynamicConfigObj.allStreams = new NodeStreams();

    // Check redundancy if more than one serverNode was returned
    dynamicConfigObj.redundancy = (snList.length > 1);

    // Check stream status by order:
    // (1) If one serverNode is Playable -> Live
    // (2) If one serverNode is Broadcasting -> Broadcasting
    // (3) Any other state -> Offline
    let playingServerNode = snList.find(sn => { return sn.status === KalturaEntryServerNodeStatus.playable; });
    if (playingServerNode) {
      dynamicConfigObj.streamStatus = 'Live';
    }
    else {
      let isBroadcasting = snList.find(sn => { return (sn.status === KalturaEntryServerNodeStatus.broadcasting); });
      if (isBroadcasting) {
        dynamicConfigObj.streamStatus = 'Initializing';
      }
      else {
        dynamicConfigObj.streamStatus = 'Offline';
      }
    }

    if (snList.length > 0) {
      dynamicConfigObj.streamCreationTime = snList[0].createdAt ? snList[0].createdAt.valueOf() : null;

      // find all primary & secondary streams and find earliest createdAt stream time
      snList.forEach((eServerNode) => {

        // get all stream available (primary, secondary)
        if (KalturaEntryServerNodeType.livePrimary.equals(eServerNode.serverType)) {
          dynamicConfigObj.allStreams.primary = (<KalturaLiveEntryServerNode> eServerNode).streams;
        }
        else if (KalturaEntryServerNodeType.liveBackup.equals(eServerNode.serverType)) {
          dynamicConfigObj.allStreams.secondary = (<KalturaLiveEntryServerNode> eServerNode).streams;
        }

        // get the earliest eServerNode.createdAt time available
        if (moment(eServerNode.createdAt).isBefore(dynamicConfigObj.streamCreationTime)) {
          dynamicConfigObj.streamCreationTime = eServerNode.createdAt.valueOf();
        }
      });
    }

    return dynamicConfigObj;
  }

  private _runStreamHealthMonitoring(): void {
    this._pullRequestStreamHealthMonitoring = this._entryTimerTask.runTimer(() => {
      return this._kalturaClient.request(new BeaconGetLastAction({
        filter: new KalturaBeaconFilter({objectIdEqual: this._id})
      }))
        .do(response => {
          // Update diagnostics object with recent beacons info
          this._parseEntryBeacons(response.objects);
          this._entryDiagnostics.next(this._entryDiagnosticsInfo);
          this._updatedApplicationStatus('streamHealth', LoadingStatus.succeeded);
          return;
        })
        .catch((err, caught) => {
          this._updatedApplicationStatus('streamHealth', LoadingStatus.failed);
          return caught;
        });
    }, environment.liveEntryService.streamHealthIntervalTimeInMs)
      .subscribe(response => {
        if (response.errorType === 'timeout') {
          // TODO: show network connectivity issue!!!
        }
      });
  }

  private _parseEntryBeacons(beaconsArray: KalturaBeacon[]): void {
    _.each(beaconsArray, b => {
      let metaData = JSON.parse(b.privateData);
      switch (b.eventType) {
        case '0_staticData':
          if (b.createdAt !== this._entryDiagnosticsInfo.staticInfo.updatedTime) {
            this._entryDiagnosticsInfo.staticInfo.updatedTime = b.createdAt;
            this._entryDiagnosticsInfo.staticInfo.data = metaData;
          }
          return;
        case '0_dynamicData':
          if (b.createdAt !== this._entryDiagnosticsInfo.dynamicInfo.updatedTime) {
            this._entryDiagnosticsInfo.dynamicInfo.updatedTime = b.createdAt;
            this._entryDiagnosticsInfo.dynamicInfo = metaData;
          }
          return;
        case '0_healthData':
          if (b.createdAt !== this._entryDiagnosticsInfo.streamHealth.updatedTime) {
            this._entryDiagnosticsInfo.streamHealth.updatedTime = b.createdAt;
            this._entryDiagnosticsInfo.streamHealth.health = metaData.streamHealth;
            if (metaData.alerts.length) {
              this._entryDiagnosticsInfo.streamHealth.alerts = metaData.alerts;
            }
          }
          return;
        default:
          console.log(`Beacon event Type unknown: ${b.eventType}`);
      }
    });
  }

  private _getNumOfWatchers(): Observable<any> {

    let liveReportsRequest = new LiveReportsGetEventsAction({
      reportType: KalturaLiveReportType.entryTimeLine,
      filter: new KalturaLiveReportInputFilter({
        entryIds: this._liveDashboardConfiguration.entryId,
        fromTime: moment().subtract(1000, 'seconds').toDate(),
        toTime: moment().subtract(2, 'seconds').toDate(),
        live: KalturaNullableBoolean.trueValue
      })
    });

    return this._kalturaClient.request(liveReportsRequest)
      .map(response => {
        this._numOfWatcherSubject.next(response);
      },
      error => {
        console.log("Live Entry: Error get number of watchers");
      });
  }

  /*public saveLiveStreamEntry(): void {
    let diffProperties = _.filter(this._propertiesToUpdate, (p) => {
      return (this._liveStream.value[p] !== this._cachedLiveStream[p]);
    });
    let liveStreamArgument = new KalturaLiveStreamEntry();
    for (let property of diffProperties) {
      liveStreamArgument[property] = this._liveStream.value[property];
    }
    this._kalturaClient.request(new LiveStreamUpdateAction({
      entryId: this._id,
      liveStreamEntry: liveStreamArgument
    }))
      .subscribe(response => {
        this._liveStream.next(response);
        this._cachedLiveStream = JSON.parse(JSON.stringify(response));
      });
  }*/
}
