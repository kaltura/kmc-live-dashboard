import { Component, OnInit } from '@angular/core';
import { LiveEntryService } from "../live-entry.service";
import { KalturaEntryModerationStatus } from "kaltura-typescript-client/types/KalturaEntryModerationStatus";
import { KalturaMediaType } from "kaltura-typescript-client/types/KalturaMediaType";
import { environment_dev } from "../../environments/environment.dev";

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


  constructor(private _liveEntryService : LiveEntryService) { }

  ngOnInit() {
    this._liveEntryService.liveStream$.subscribe(liveStreamEntry => {
      if (liveStreamEntry) {
        this._creator = liveStreamEntry.creatorId;
        this._date = liveStreamEntry.createdAt;
        this._type = liveStreamEntry.mediaType;
        this._moderation = liveStreamEntry.moderationStatus;
        this._plays = liveStreamEntry.plays;
        this._entryId = liveStreamEntry.id;

        const partnerID = liveStreamEntry.partnerId;
        const id = liveStreamEntry.id;
        const ks = environment_dev.kaltura.ks;
        const host = environment_dev.kaltura.host;
        const uiConfIf = environment_dev.kaltura.uiConfId;

        this._playerSrc = `http://${host}/p/${partnerID}/sp/${partnerID}00/embedIframeJs/uiconf_id/${uiConfIf}/partner_id/${partnerID}?iframeembed=true&flashvars[closedCaptions.plugin]=true&flashvars[EmbedPlayer.SimulateMobile]=true&&flashvars[ks]=${ks}&flashvars[EmbedPlayer.EnableMobileSkin]=true&entry_id=${id}`;
      }
    })
  }

}
