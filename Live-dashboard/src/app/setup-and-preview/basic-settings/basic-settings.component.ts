import { Component, OnInit } from '@angular/core';
import { LiveEntryService } from "../../live-entry.service";
import { KalturaLiveStreamEntry } from "kaltura-typescript-client/types/KalturaLiveStreamEntry";

@Component({
  selector: 'basic-settings',
  templateUrl: 'basic-settings.component.html',
  styleUrls: ['basic-settings.component.scss']
})
export class BasicSettingsComponent implements OnInit {
  public _currentEntry: KalturaLiveStreamEntry;

  constructor(private _liveEntryService: LiveEntryService) { }

  ngOnInit() {
    this._liveEntryService.liveStream$.subscribe(response => {
      if (response) {
        this._currentEntry = response;
      }
    });
  }
}
