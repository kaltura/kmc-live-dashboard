import { Component, OnDestroy, OnInit } from '@angular/core';
import { LiveEntryService } from "../services/live-entry.service";
import { KalturaEntryModerationStatus } from "kaltura-typescript-client/types/KalturaEntryModerationStatus";
import { KalturaMediaType } from "kaltura-typescript-client/types/KalturaMediaType";
import { LiveDashboardConfiguration } from "../services/live-dashboard-configuration.service";
import { LiveEntryDynamicStreamInfo, LoadingStatus } from "../types/live-dashboard.types";
import { ISubscription } from "rxjs/Subscription";
import { KalturaViewMode } from "kaltura-typescript-client/types/KalturaViewMode";
import {KalturaLiveStreamEntry} from "kaltura-typescript-client/types/KalturaLiveStreamEntry";
import {KalturaRecordingStatus} from "kaltura-typescript-client/types/KalturaRecordingStatus";

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
  public  _playerSrc: string = '';

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

        const partnerID = response.partnerId;
        const entryId = response.id;
        const ks = this._liveDashboardConfiguration.ks;
        const uiConfId = this._liveDashboardConfiguration.uiConfId;
        const serviceUrl = this._liveDashboardConfiguration.service_url;

        this._playerSrc = `${serviceUrl}/p/${partnerID}/sp/${partnerID}00/embedIframeJs/uiconf_id/${uiConfId}/partner_id/${partnerID}?iframeembed=true&flashvars[ks]=${ks}&entry_id=${entryId}`;

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
}
