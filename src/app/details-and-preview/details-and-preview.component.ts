import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { LiveEntryService } from "../services/live-entry.service";
import { LiveDashboardConfiguration } from "../services/live-dashboard-configuration.service";
import { LiveEntryDynamicStreamInfo, LoadingStatus, PlayerConfig } from "../types/live-dashboard.types";
import { ISubscription } from "rxjs/Subscription";
import { KalturaViewMode } from "kaltura-typescript-client/types/KalturaViewMode";
import { KalturaLiveStreamEntry } from "kaltura-typescript-client/types/KalturaLiveStreamEntry";
import { KalturaRecordingStatus } from "kaltura-typescript-client/types/KalturaRecordingStatus";

interface ExplicitLiveObject {
  enabled?: boolean,
  previewMode?: boolean
}

@Component({
  selector: 'details-and-preview',
  templateUrl: './details-and-preview.component.html',
  styleUrls: ['./details-and-preview.component.scss']
})
export class DetailAndPreviewComponent implements OnInit, OnDestroy {
  public  _applicationLoaded: boolean;
  private _applicationStatusSubscription: ISubscription;
  private _liveStreamSubscription: ISubscription;
  private _dynamicInformationSubscription: ISubscription;

  public  _dynamicInfo: LiveEntryDynamicStreamInfo = {
    redundancy: false,
    streamStatus: 'Offline'
  };
  public  _explicitLiveInformation: ExplicitLiveObject = {};
  public  _liveEntry: KalturaLiveStreamEntry;
  public  _playerConfig: PlayerConfig = {};
  public _inFullScreen = false;
  private _kdp: any;

  @Input() compactMode = false;

  constructor(private _liveEntryService : LiveEntryService,
              private _liveDashboardConfiguration: LiveDashboardConfiguration) { }

  ngOnInit() {
    this._listenToApplicationStatus();
    this._subscribeToLiveStream();
    this._subscribeToDynamicInformation();
  }

  ngOnDestroy() {
    this._applicationStatusSubscription.unsubscribe();
    this._liveStreamSubscription.unsubscribe();
    this._dynamicInformationSubscription.unsubscribe();
    this._kdp.kUnbind('.liveDashboard');
  }

  private _listenToApplicationStatus(): void {
    this._applicationStatusSubscription = this._liveEntryService.applicationStatus$
      .subscribe(response => {
        if (response) {
          this._applicationLoaded = (response.liveEntry === LoadingStatus.succeeded) &&
                                    (response.streamStatus === LoadingStatus.succeeded)
        }
      });
  }

  private _subscribeToLiveStream(): void {
    this._liveStreamSubscription = this._liveEntryService.liveStream$.subscribe(response => {
      if (response) {
        this._liveEntry = response;

        this._playerConfig.partnerId = response.partnerId;
        this._playerConfig.entryId = response.id;
        this._playerConfig.ks = this._liveDashboardConfiguration.ks;
        this._playerConfig.uiConfId = this._liveDashboardConfiguration.uiConfId;
        this._playerConfig.serviceUrl = this._liveDashboardConfiguration.service_url;
        this._playerConfig.flashVars = {
          SkipKSOnIsLiveRequest: false,
          ks: this._playerConfig.ks
        };

        this._explicitLiveInformation.enabled = response.explicitLive;
        this._explicitLiveInformation.previewMode = response.viewMode === KalturaViewMode.preview;
      }
    });
  }

  private _subscribeToDynamicInformation(): void {
    this._dynamicInformationSubscription = this._liveEntryService.entryDynamicInformation$.subscribe(response => {
      if (response) {
        this._dynamicInfo = response;
      }
    });
  }

  public _onClickGoLive() {
    this._liveEntry.viewMode = KalturaViewMode.allowAll;
    this._liveEntry.recordingStatus = KalturaRecordingStatus.active;

    this._liveEntryService.updateLiveStreamEntry(['viewMode', 'recordingStatus']);
  }

  public _onClickEndLive() {
    this._liveEntry.viewMode = KalturaViewMode.preview;
    this._liveEntry.recordingStatus = KalturaRecordingStatus.stopped;

    this._liveEntryService.updateLiveStreamEntry(['viewMode', 'recordingStatus']);
  }

  public _onPlayerReady(kdp: any) {
    this._kdp = kdp;
    kdp.kBind( "openFullScreen.liveDashboard", () => {
      this._inFullScreen = true;
    });
    kdp.kBind( "closeFullScreen.liveDashboard", () => {
      this._inFullScreen = false;
    });

  }
}
