import { Component, OnDestroy, OnInit } from '@angular/core';
import { LiveEntryService } from "../services/live-entry.service";
import { KalturaEntryModerationStatus } from "kaltura-typescript-client/types/KalturaEntryModerationStatus";
import { KalturaMediaType } from "kaltura-typescript-client/types/KalturaMediaType";
import { LiveDashboardConfiguration } from "../services/live-dashboard-configuration.service";
import { LiveEntryDynamicStreamInfo, LoadingStatus } from "../types/live-dashboard.types";
import { ISubscription } from "rxjs/Subscription";

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
  public  _creator: string;
  public  _date: Date;
  public  _type: KalturaMediaType;
  public  _moderation: KalturaEntryModerationStatus;
  public  _plays: number;
  public  _entryId: string;
  public  _playerSrc: string = '';
  public  _dynamicInfo: LiveEntryDynamicStreamInfo = {
    redundancy: false,
    streamStatus: 'Offline'
  };

  constructor(private _liveEntryService : LiveEntryService,
              private _liveDashboardConfiguration: LiveDashboardConfiguration) { }

  ngOnInit() {
    this._subscribeToApplicationStatus();
    this._subscribeToLiveStream();
    this._subscribeToDynamicInformation();
  }

  ngOnDestroy() {
    this._applicationStatusSubscription.unsubscribe();
    this._liveStreamSubscription.unsubscribe();
    this._dynamicInformationSubscription.unsubscribe();
  }

  private _subscribeToApplicationStatus(): void {
    this._applicationStatusSubscription = this._liveEntryService.applicationStatus$
      .subscribe(response => {
        if (response) {
          this._applicationLoaded = (response.liveEntry === LoadingStatus.succeeded) &&
            (response.streamStatus === LoadingStatus.succeeded) &&
            (response.streamHealth === LoadingStatus.succeeded)
        }
      });
  }

  private _subscribeToLiveStream(): void {
    this._liveStreamSubscription = this._liveEntryService.liveStream$.subscribe(liveStreamEntry => {
      if (liveStreamEntry) {
        this._creator = liveStreamEntry.creatorId;
        this._date =    liveStreamEntry.createdAt;
        this._type =    liveStreamEntry.mediaType;
        this._moderation = liveStreamEntry.moderationStatus;
        this._plays =   liveStreamEntry.plays;
        this._entryId = liveStreamEntry.id;

        const partnerID = liveStreamEntry.partnerId;
        const entryId =   liveStreamEntry.id;
        const ks =        this._liveDashboardConfiguration.ks;
        const uiConfId =  this._liveDashboardConfiguration.uiConfId;
        const serviceUrl = this._liveDashboardConfiguration.service_url;

        this._playerSrc = `${serviceUrl}/p/${partnerID}/sp/${partnerID}00/embedIframeJs/uiconf_id/${uiConfId}/partner_id/${partnerID}?iframeembed=true&flashvars[ks]=${ks}&entry_id=${entryId}`;
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
}
