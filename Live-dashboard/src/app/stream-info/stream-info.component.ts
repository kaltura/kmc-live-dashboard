import { Component, OnInit } from '@angular/core';
import { LiveEntryService } from "../services/live-entry.service";
import { KalturaEntryModerationStatus } from "kaltura-typescript-client/types/KalturaEntryModerationStatus";
import { KalturaMediaType } from "kaltura-typescript-client/types/KalturaMediaType";
import { LiveDashboardConfiguration} from "../services/live-dashboard-configuration.service";
import {LiveEntryDynamicStreamInfo} from "../types/live-dashboard.types";

@Component({
  selector: 'stream-info',
  templateUrl: './stream-info.component.html',
  styleUrls: ['./stream-info.component.scss']
})
export class StreamInfoComponent implements OnInit {
  public _creator: string;
  public _date: Date;
  public _type: KalturaMediaType;
  public _moderation: KalturaEntryModerationStatus;
  public _plays: number;
  public _entryId: string;
  public _playerSrc: string = '';
  public _dynamicInfo: LiveEntryDynamicStreamInfo = {
    redundancy: false,
    streamStatus: 'Offline'
  };

  constructor(private _liveEntryService : LiveEntryService,
              private _liveDashboardConfiguration: LiveDashboardConfiguration) { }

  ngOnInit() {
    this._liveEntryService.liveStream$.subscribe(liveStreamEntry => {
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
        const host =      this._liveDashboardConfiguration.host;
        const uiConfId =  this._liveDashboardConfiguration.uiConfId;

        this._playerSrc = `${host}/p/${partnerID}/sp/${partnerID}00/embedIframeJs/uiconf_id/${uiConfId}/partner_id/${partnerID}?iframeembed=true&flashvars[closedCaptions.plugin]=true&flashvars[ks]=${ks}&entry_id=${entryId}`;
      }
    });

    this._liveEntryService.entryDynamicInformation$.subscribe(response => {
      if (response) {
        this._dynamicInfo = response;
      }
    });
  }

}
