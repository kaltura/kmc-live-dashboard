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
import { LiveDashboardConfiguration } from "./live-dashboard-configuration.service";
import { environment } from "../../environments/environment";

// Kaltura objects and types
import { KalturaAPIException } from "kaltura-typescript-client";
import { LiveStreamGetAction } from "kaltura-typescript-client/types/LiveStreamGetAction";
import { KalturaLiveStreamEntry } from "kaltura-typescript-client/types/KalturaLiveStreamEntry";
import { EntryServerNodeListAction } from "kaltura-typescript-client/types/EntryServerNodeListAction";
import { KalturaEntryServerNodeFilter } from "kaltura-typescript-client/types/KalturaEntryServerNodeFilter";
import { KalturaEntryServerNode } from "kaltura-typescript-client/types/KalturaEntryServerNode";
import { KalturaAssetParamsOrigin } from "kaltura-typescript-client/types/KalturaAssetParamsOrigin";
import { KalturaDVRStatus } from "kaltura-typescript-client/types/KalturaDVRStatus";
import { KalturaRecordStatus } from "kaltura-typescript-client/types/KalturaRecordStatus";
import { KalturaEntryServerNodeStatus } from "kaltura-typescript-client/types/KalturaEntryServerNodeStatus";
import { KalturaLiveStreamAdminEntry } from "kaltura-typescript-client/types/KalturaLiveStreamAdminEntry";
import { KalturaLiveEntryServerNode } from "kaltura-typescript-client/types/KalturaLiveEntryServerNode";
import { KalturaEntryServerNodeType } from "kaltura-typescript-client/types/KalturaEntryServerNodeType";
import { BeaconListAction } from "kaltura-typescript-client/types/BeaconListAction";
import { KalturaBeaconFilter } from "kaltura-typescript-client/types/KalturaBeaconFilter";
import { KalturaFilterPager } from "kaltura-typescript-client/types/KalturaFilterPager";
import { KalturaBeaconIndexType } from "kaltura-typescript-client/types/KalturaBeaconIndexType";
import { KalturaBeacon } from "kaltura-typescript-client/types/KalturaBeacon";
import { LiveReportsGetEventsAction } from "kaltura-typescript-client/types/LiveReportsGetEventsAction";
import { KalturaLiveReportType } from "kaltura-typescript-client/types/KalturaLiveReportType";
import { KalturaLiveReportInputFilter } from "kaltura-typescript-client/types/KalturaLiveReportInputFilter";
import { KalturaNullableBoolean } from "kaltura-typescript-client/types/KalturaNullableBoolean";
// Types
import {
  NodeStreams, LiveStreamStates, LiveStreamSession, LiveEntryDynamicStreamInfo, LiveEntryStaticConfiguration,
  ApplicationStatus, LoadingStatus, LiveEntryDiagnosticsInfo
} from "../types/live-dashboard.types";
// Piepes
import { CodeToSeverityPipe } from "../pipes/code-to-severity.pipe";

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
  private _entryDynamicInformation = new BehaviorSubject<LiveEntryDynamicStreamInfo>({
    streamStatus: 'Offline',
    streamSession: {
      isInProgress: false,
      timerStartTime: Date.now(),
      shouldTimerRun: false
    }
  });
  public entryDynamicInformation$ = this._entryDynamicInformation.asObservable();
  // BehaviorSubjects subscribed by configuration display component for diagnostics and health monitoring
  private _entryDiagnosticsInfo: LiveEntryDiagnosticsInfo = {
    staticInfo: { updatedTime: 0 },
    dynamicInfo: { updatedTime: 0 },
    streamHealth: { updatedTime: 0 }
  };
  private _entryDiagnostics = new BehaviorSubject<LiveEntryDiagnosticsInfo>(null);
  public entryDiagnostics$ = this._entryDiagnostics.asObservable();

  private _pullRequestEntryStatusMonitoring: ISubscription;
  private _pullRequestStreamHealthMonitoring: ISubscription;

  private _propertiesToUpdate = ['name', 'description', 'conversionProfileId', 'dvrStatus', 'recordStatus'];

  // BehaviorSubject to show number of watchers when stream is Live
  private _numOfWatcherSubject = new BehaviorSubject<any>(null);
  public numOfWatcher$ = this._numOfWatcherSubject.asObservable();
  private _numOfWatchersTimerSubscription: Subscription = null;


  constructor(private _kalturaClient: KalturaClient,
              private _entryTimerTask: LiveEntryTimerTaskService,
              private _conversionProfilesService: ConversionProfileService,
              private _liveDashboardConfiguration: LiveDashboardConfiguration,
              private _codeToSeverityPipe: CodeToSeverityPipe) {

    this._id = this._liveDashboardConfiguration.entryId;
    this._listenToNumOfWatcherWhenLive();
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

  public InitializeLiveEntryService(): void {
    this._getLiveStream();
    this._runEntryStatusMonitoring();
    this._streamHealthInitialization();
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
        .retryWhen(errors => errors
          .do(val => {
            if (val instanceof KalturaAPIException) {
              console.log(`[LiveStreamGet] Exception was thrown: ${val.message}`);
            }
          })
          .delay(environment.liveEntryService.apiCallDelayOnException)
          .take(environment.liveEntryService.apiCallsMaxRetriesAttempts)
          .concat(Observable.throw(`[LiveStreamGet] Failed for ${environment.liveEntryService.apiCallsMaxRetriesAttempts} consecutive attempts`))
        )
        .catch((err, caught) => {
          console.log(err);
          this._updatedApplicationStatus('liveEntry', LoadingStatus.failed);
          return caught;
        })
      .subscribe(response => {
        if (response instanceof KalturaLiveStreamEntry) {
          this._cachedLiveStream = JSON.parse(JSON.stringify(response));
          this._liveStream.next(response);
          this._parseEntryConfiguration(response);
        }
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
        console.log(`[LiveStreamGet] Finished successfully`);
      });
  }

  private _runEntryStatusMonitoring(): void {
    this._pullRequestEntryStatusMonitoring = this._entryTimerTask.runTimer(() => {
      return this._kalturaClient.request(new EntryServerNodeListAction({
        filter: new KalturaEntryServerNodeFilter({entryIdEqual: this._id})
      }))
        .do(response => {
          this._parseEntryServeNodeList(response.objects);
          this._updatedApplicationStatus('streamStatus', LoadingStatus.succeeded);
          return;
        })
        .catch((err, caught) => {
          console.log(`[EntryServeNodeList] Error: ${err.message}`);
          this._updatedApplicationStatus('streamStatus', LoadingStatus.failed);
          throw caught;
        });
    }, environment.liveEntryService.streamStatusIntervalTimeInMs)
      .subscribe(response => {
        if (response.errorType === 'timeout') {
          // TODO: show network connectivity issue!!!
        }
      });
  }

  private _parseEntryServeNodeList(snList: KalturaEntryServerNode[]): void {
    let dynamicConfigObj = this._entryDynamicInformation.getValue();
    // Check redundancy if more than one serverNode was returned
    dynamicConfigObj.redundancy = (snList.length > 1);
    let newStreamState = this._getStreamStatus(snList);
    this._streamSessionStateUpdate(dynamicConfigObj.streamStatus, newStreamState, dynamicConfigObj.streamSession);
    dynamicConfigObj.streamStatus = newStreamState;
    this._updateStreamsInfo(snList, dynamicConfigObj);

    this._entryDynamicInformation.next(dynamicConfigObj);
  }

  private _getStreamStatus(serverNodeList: KalturaEntryServerNode[]): LiveStreamStates {
    // Check stream status by order:
    // (1) If one serverNode is Playable -> Live
    // (2) If one serverNode is Broadcasting -> Broadcasting
    // (3) Any other state -> Offline
    let playingServerNode = serverNodeList.find(sn => { return sn.status === KalturaEntryServerNodeStatus.playable; });
    if (playingServerNode) {
      return 'Live';
    }
    else {
      let isBroadcasting = serverNodeList.find(sn => { return (sn.status === KalturaEntryServerNodeStatus.broadcasting); });
      if (isBroadcasting) {
        return 'Initializing';
      }
      else {
        return 'Offline';
      }
    }
  }

  private _streamSessionStateUpdate(currentState: LiveStreamStates, nextState: LiveStreamStates, session: LiveStreamSession): void {
    // Session is in progress on only when in Live state
    if (currentState !== 'Live' && nextState === 'Live') {
      session.isInProgress = true;
      session.shouldTimerRun = false;
    }
    // If stream is not longer live, start grace period timer
    if (currentState === 'Live' && nextState === 'Offline') {
      session.shouldTimerRun = true;
      session.timerStartTime = Date.now();
    }
    // If timer is running check if session grace period expired
    if (session.shouldTimerRun && (Date.now() - session.timerStartTime > environment.liveEntryService.streamSessionGracePeriodInMs)) {
      session.isInProgress = false;
    }
  }

  private _updateStreamsInfo(serverNodeList: KalturaEntryServerNode[], dynamicInfoObj: LiveEntryDynamicStreamInfo): void {
    dynamicInfoObj.allStreams = new NodeStreams();
    if (serverNodeList.length > 0) {
      dynamicInfoObj.streamCreationTime = serverNodeList[0].createdAt ? serverNodeList[0].createdAt.valueOf() : null;
      // find all primary & secondary streams and find earliest createdAt stream time
      serverNodeList.forEach((eServerNode) => {
        // get all stream available (primary, secondary)
        if (KalturaEntryServerNodeType.livePrimary.equals(eServerNode.serverType)) {
          dynamicInfoObj.allStreams.primary = (<KalturaLiveEntryServerNode> eServerNode).streams;
        }
        else if (KalturaEntryServerNodeType.liveBackup.equals(eServerNode.serverType)) {
          dynamicInfoObj.allStreams.secondary = (<KalturaLiveEntryServerNode> eServerNode).streams;
        }

        // get the earliest eServerNode.createdAt time available
        if (moment(eServerNode.createdAt).isBefore(dynamicInfoObj.streamCreationTime)) {
          dynamicInfoObj.streamCreationTime = eServerNode.createdAt.valueOf();
        }
      });
    }
  }

  private _streamHealthInitialization(): void {
    this._kalturaClient.request(new BeaconListAction({
      filter: new KalturaBeaconFilter({
        orderBy: '-createdAt',
        eventTypeIn: '0_healthData,1_healthData',
        objectIdIn: this._id,
        indexTypeEqual: KalturaBeaconIndexType.log
      }),
      pager: new KalturaFilterPager({
        pageSize: environment.liveEntryService.maxBeaconHealthReportsToShow
      })
    }))
    .subscribe(response => {
      this._parseEntryBeacons(response.objects  );
      this._entryDiagnostics.next(this._entryDiagnosticsInfo);
      return this._runStreamHealthMonitoring();
    })
  }

  private _runStreamHealthMonitoring(): void {
    this._pullRequestStreamHealthMonitoring = this._entryTimerTask.runTimer(() => {
      return this._kalturaClient.request(new BeaconListAction({
        filter: new KalturaBeaconFilter({
          objectIdIn: this._id,
          indexTypeEqual: KalturaBeaconIndexType.state
        })
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

    // As this is only the delta portion of the reports (beacon) so
    // only the delta will be pushed as an event subject.
    this._entryDiagnosticsInfo.streamHealth.data = [];

    _.each(beaconsArray, b => {
      let privateData = JSON.parse(b.privateData);
      let eventType = b.eventType.substring(2);
      let isPrimary = (b.eventType[0] === '0');

      switch (eventType) {
        case 'staticData':
          if (b.updatedAt !== this._entryDiagnosticsInfo.staticInfo.updatedTime) {
            this._entryDiagnosticsInfo.staticInfo.updatedTime = b.createdAt;
            this._entryDiagnosticsInfo.staticInfo.data = privateData;
          }
          return;
        case 'dynamicData':
          if (b.updatedAt !== this._entryDiagnosticsInfo.dynamicInfo.updatedTime) {
            this._entryDiagnosticsInfo.dynamicInfo.updatedTime = b.createdAt;
            this._entryDiagnosticsInfo.dynamicInfo = privateData;
          }
          return;
        case 'healthData':
          if (b.updatedAt !== this._entryDiagnosticsInfo.streamHealth.updatedTime) {
            let report = {
              updatedTime: b.updatedAt * 1000,
              severity: privateData.maxSeverity,
              isPrimary: isPrimary,
              alerts: _.isArray(privateData.alerts) ?  privateData.alerts : []
            };

            // sort alerts by their severity (-desc)
            report.alerts = (_.sortBy(report.alerts, [(alert)=> {
              return -this._codeToSeverityPipe.transform(alert.Code).valueOf();
            }]));

            this._entryDiagnosticsInfo.streamHealth.data.push(report);
            this._entryDiagnosticsInfo.streamHealth.updatedTime = b.updatedAt;
          }

          return;
        default:
          console.log(`Beacon event Type unknown: ${eventType}`);
      }
    });
  }

  private _listenToNumOfWatcherWhenLive(): void {
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
