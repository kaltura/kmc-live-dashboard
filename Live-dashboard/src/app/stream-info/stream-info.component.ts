import { Component, OnInit } from '@angular/core';
import { LiveEntryService } from "../live-entry.service";
import { KalturaEntryModerationStatus } from "kaltura-typescript-client/types/KalturaEntryModerationStatus";
import { KalturaMediaType } from "kaltura-typescript-client/types/KalturaMediaType";

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

  constructor(private _liveEntryService : LiveEntryService) { }

  ngOnInit() {
    this._liveEntryService.liveStream$.subscribe(response => {
      if (response) {
        // this.currentEntry = resposne;
        this._creator = response.creatorId;
        this._date = response.createdAt;
        this._type = response.mediaType;
        this._moderation = response.moderationStatus;
        this._plays = response.plays;
      }
    })
  }
}
