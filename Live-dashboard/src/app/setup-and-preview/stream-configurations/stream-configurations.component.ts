import { Component, OnInit } from '@angular/core';

import { LiveEntryService, LiveStreamStatusEnum } from "../../live-entry.service";

@Component({
  selector: 'stream-configurations',
  templateUrl: 'stream-configurations.component.html',
  styleUrls: ['stream-configurations.component.scss']
})
export class StreamConfigurationsComponent implements OnInit {
  public _elapsedTime: string = "00:00:00";
  // Static configuration
  public _dvr: string = "";
  public _recording: string = "";
  public _transcoding: string = "";
  // Dynamic configuration
  public _redundancy: string = "";
  public _streamStatus: string = "";

  constructor(private _liveEntryService: LiveEntryService) { }

  ngOnInit() {
    this._liveEntryService.entryStaticConfiguration$.subscribe(response => {
      if (response) {
        this._dvr = (response.dvr) ? "On" : "Off";
        this._recording = (response.recording) ? "On" : "Off";
        this._transcoding = (response.transcoding) ? "On" : "Off";
      }
    });
    this._liveEntryService.entryDynmicConfiguration$.subscribe(response => {
      if (response) {
        this._redundancy = (response.redundancy) ? "On" : "N/A";
        this._streamStatus = this._parseStreamStatus(response.streamStatus);
      }
    })
  }

  private _parseStreamStatus(status: LiveStreamStatusEnum): 'Offline' | 'Initializing' | 'Live' {
    switch (status) {
      case LiveStreamStatusEnum.Live:
        return 'Live';
      case LiveStreamStatusEnum.Broadcasting:
        return 'Initializing';
      default:
        return 'Offline';
    }
  }

  // public _checkStreamStatusLiveState(state: string): boolean { }
}
