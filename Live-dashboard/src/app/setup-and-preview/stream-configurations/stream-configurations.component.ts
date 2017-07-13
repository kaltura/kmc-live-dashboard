import { Component, OnInit } from '@angular/core';

import { LiveEntryService, LiveStreamStatusEnum, LiveEntryStaticConfiguration, LiveEntryDynamicStreamInfo } from "../../live-entry.service";

@Component({
  selector: 'stream-configurations',
  templateUrl: 'stream-configurations.component.html',
  styleUrls: ['stream-configurations.component.scss']
})
export class StreamConfigurationsComponent implements OnInit {
  public _elapsedTime: number = Date.now();
  // Static configuration
  public _staticConfiguration: LiveEntryStaticConfiguration = {
    dvr: false,
    recording: false,
    transcoding: false
  };
  // Dynamic configuration
  public _dynaminConfiguration: LiveEntryDynamicStreamInfo = {
    redundancy: false,
    streamStatus: LiveStreamStatusEnum.Offline
  };
  public _redundancy: string = "";
  public _streamStatus: string = "";

  constructor(private _liveEntryService: LiveEntryService) { }

  ngOnInit() {
    this._liveEntryService.entryStaticConfiguration$.subscribe(response => {
      if (response) {
        this._staticConfiguration = response;
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
        this._startLiveEntryTimer();
        return 'Initializing';
      default:
        return 'Offline';
    }
  }

  private _startLiveEntryTimer(): void {

  }
}
