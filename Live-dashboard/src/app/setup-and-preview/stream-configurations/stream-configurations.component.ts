import { Component, OnInit } from '@angular/core';
import { ISubscription } from "rxjs/Subscription";
import { Observable } from "rxjs";

import { LiveEntryService, LiveStreamStatusEnum, LiveEntryStaticConfiguration, LiveEntryDynamicStreamInfo } from "../../live-entry.service";

@Component({
  selector: 'stream-configurations',
  templateUrl: 'stream-configurations.component.html',
  styleUrls: ['stream-configurations.component.scss']
})
export class StreamConfigurationsComponent implements OnInit {
  public _elapsedTime: number = 0;
  // Static configuration
  public _staticConfiguration: LiveEntryStaticConfiguration = {
    dvr: false,
    recording: false,
    transcoding: false
  };
  // Dynamic configuration
  public _dynamicConfiguration: LiveEntryDynamicStreamInfo = {
    redundancy: false,
    streamStatus: LiveStreamStatusEnum.Offline,
    streamStartTime: 0
  };

  constructor(private _liveEntryService: LiveEntryService) { }

  ngOnInit() {
    this._liveEntryService.entryStaticConfiguration$.subscribe(response => {
      if (response) {
        this._staticConfiguration = response;
      }
    });
    this._liveEntryService.entryDynamicConfiguration$.subscribe(response => {
      if (response) {
        this._dynamicConfiguration = response;
      }
    });
  }
}
