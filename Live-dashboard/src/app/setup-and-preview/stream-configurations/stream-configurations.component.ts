import { Component, OnInit } from '@angular/core';
import { LiveEntryService } from "../../live-entry.service";
import { KalturaDVRStatus } from "kaltura-typescript-client/types/KalturaDVRStatus";
import { KalturaRecordStatus } from "kaltura-typescript-client/types/KalturaRecordStatus";

@Component({
  selector: 'stream-configurations',
  templateUrl: 'stream-configurations.component.html',
  styleUrls: ['stream-configurations.component.scss']
})
export class StreamConfigurationsComponent implements OnInit {
  public _dvrStatus: String = "";
  public _recordingStatus: String = "";

  constructor(private _liveEntryService: LiveEntryService) { }

  ngOnInit() {
    this._liveEntryService.liveStream$.subscribe(response => {
      if (response) {
        this._dvrStatus = (response.dvrStatus === KalturaDVRStatus.enabled) ? "On" : "N/A";
        this._recordingStatus = (response.recordStatus !== KalturaRecordStatus.disabled) ? "On" : "N/A";
      }
    })
  }

  checkBooleanConfigurationState(state: string): boolean {
    return state === "On";
  }

}
