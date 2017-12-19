import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { LiveEntryService } from "../services/live-entry.service";
import { LiveDashboardConfiguration } from "../services/live-dashboard-configuration.service";
import { LiveEntryDynamicStreamInfo, LoadingStatus, PlayerConfig } from "../types/live-dashboard.types";
import { ISubscription } from "rxjs/Subscription";
import { KalturaViewMode } from "kaltura-ngx-client/api/types/KalturaViewMode";
import { KalturaLiveStreamEntry } from "kaltura-ngx-client/api/types/KalturaLiveStreamEntry";
import { KalturaRecordingStatus } from "kaltura-ngx-client/api/types/KalturaRecordingStatus";
import { ConfirmationService } from "primeng/primeng";
import { AppLocalization } from "@kaltura-ng/kaltura-common";
import { KalturaNullableBoolean } from "kaltura-ngx-client/api/types/KalturaNullableBoolean";

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
  private _explicitLiveWaitFlagSubscription: ISubscription;

  public  _dynamicInfo: LiveEntryDynamicStreamInfo = {
    redundancy: false,
    streamStatus: 'Offline'
  };
  private _tempExplicitLiveInformation: ExplicitLiveObject = {};
  public  _explicitLiveInformation: ExplicitLiveObject;
  public  _liveEntry: KalturaLiveStreamEntry;
  public  _explicitLiveWaitFlag = false;
  public  _playerConfig: PlayerConfig = {};
  public  _inFullScreen = false;
  private _kdp: any;

  @Input() compactMode = false;
  @Input() colorsReverted = false;

  constructor(private _liveEntryService : LiveEntryService,
              private _liveDashboardConfiguration: LiveDashboardConfiguration,
              private _confirmationService: ConfirmationService,
              private _appLocalization: AppLocalization) {
    if (window.addEventListener) {
      window.addEventListener('message', this._receivePostMessage.bind(this), false);
    }
  }

  ngOnInit() {
    this._subscribeToApplicationStatus();
    this._subscribeToExplicitLiveWaitFlag();
    this._subscribeToLiveStream();
    this._subscribeToDynamicInformation();
  }

  ngOnDestroy() {
    this._applicationStatusSubscription.unsubscribe();
    this._liveStreamSubscription.unsubscribe();
    this._explicitLiveWaitFlagSubscription.unsubscribe();
    this._dynamicInformationSubscription.unsubscribe();
    this._kdp.kUnbind('.liveDashboard');
  }

  private _subscribeToApplicationStatus(): void {
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
        this._playerConfig.uiConfId = this._liveDashboardConfiguration.player.uiConfId;
        this._playerConfig.serviceUrl = this._liveDashboardConfiguration.service_url;
        this._playerConfig.flashVars = {
          SkipKSOnIsLiveRequest: false,
          ks: this._playerConfig.ks,
          autoPlay: this._liveDashboardConfiguration.player.autoPlay
        };

        if (typeof response.explicitLive === 'boolean') {
          this._tempExplicitLiveInformation.enabled = <boolean>response.explicitLive;
        }
        else {
          this._tempExplicitLiveInformation.enabled = response.explicitLive === KalturaNullableBoolean.trueValue;
        }
        this._tempExplicitLiveInformation.previewMode = response.viewMode === KalturaViewMode.preview;
        if (!this._explicitLiveInformation) {
          this._initializeExplicitLive();
        }
      }
    });
  }

  private _initializeExplicitLive(): void {
    this._explicitLiveInformation = {};
    this._explicitLiveInformation.enabled = this._tempExplicitLiveInformation.enabled;
    this._explicitLiveInformation.previewMode = this._tempExplicitLiveInformation.previewMode;
  }

  private _subscribeToExplicitLiveWaitFlag(): void {
    this._explicitLiveWaitFlagSubscription = this._liveEntryService.explicitLiveWait$.subscribe(response => {
      this._explicitLiveWaitFlag = response;
      if (this._explicitLiveInformation && !this._explicitLiveWaitFlag) {
        this._explicitLiveInformation.enabled = this._tempExplicitLiveInformation.enabled;
        this._explicitLiveInformation.previewMode = this._tempExplicitLiveInformation.previewMode;
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

    this._liveEntryService.updateLiveStreamEntryByApi(['viewMode', 'recordingStatus']);
  }

  public _onClickEndLive() {
    this._confirmationService.confirm({
      message: this._appLocalization.get('DETAILS_AND_PREVIEW.explicit_live.end_live_alert.message'),
      header: this._appLocalization.get('DETAILS_AND_PREVIEW.explicit_live.end_live_alert.header'),
      accept: () => {
        this._liveEntry.viewMode = KalturaViewMode.preview;
        this._liveEntry.recordingStatus = KalturaRecordingStatus.stopped;

        this._liveEntryService.updateLiveStreamEntryByApi(['viewMode', 'recordingStatus']);
      },
    });
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

  private _receivePostMessage(message: any): void {
    if (message.data.type) {
      return this._parsePostMessage(message.data);
    }
  }

  private _parsePostMessage(message: { type: string, content: any }): void {
    switch (message.type) {
      case 'onLiveEntryChange':
        this._liveEntryService.updateLiveStreamEntryByPostMessage(message.content);
        break;
      case 'playerVisible':
        if (this._kdp) {
          if (message.content === 'play') {
            this._kdp.sendNotification("doPlay");
          }
          else {
            this._kdp.sendNotification("doPause");
          }
        }
        break;
      default:
        console.log('Message type unknown!');
    }
  }
}
