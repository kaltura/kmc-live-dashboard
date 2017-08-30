import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from "rxjs";
import * as moment from 'moment';
import Duration = moment.Duration;
import * as _ from 'lodash';

import { environment } from "../../../environments/environment"
import {
  LiveEntryService, LiveEntryStaticConfiguration, LiveEntryDynamicStreamInfo, LiveEntryDiagnosticsInfo,
  StreamHealthStatus, AlertSeverity
} from "../../live-entry.service";

@Component({
  selector: 'stream-configurations',
  templateUrl: 'stream-configurations.component.html',
  styleUrls: ['stream-configurations.component.scss']
})
export class StreamConfigurationsComponent implements OnInit, OnDestroy{

  public _streamDuration: Duration;
  private _streamDurationSubscription: Subscription;
  public _staticConfiguration: LiveEntryStaticConfiguration;
  public _dynamicInformation: LiveEntryDynamicStreamInfo;
  public _streamHealth: {
    severity: AlertSeverity,
    resolution?: number
  };

  constructor(private _liveEntryService: LiveEntryService) {
    // Static configuration
    this._staticConfiguration = {
      dvr: false,
      recording: false,
      transcoding: false
    };
    // Dynamic configuration
    this._dynamicInformation = {
      redundancy: false,
      streamStatus: 'Offline'
    };
    this._streamHealth = { severity: AlertSeverity.info };
  }

  ngOnInit() {
    this._liveEntryService.entryStaticConfiguration$.subscribe(response => {
      if (response) {
        this._staticConfiguration = response;
        this._startCalculatingStreamDurationTime();
      }
    });
    this._liveEntryService.entryDynamicInformation$.subscribe(response => {
      if (response) {
        this._dynamicInformation = response;
      }
    });
    this._liveEntryService.entryDiagnostics$.subscribe((response: LiveEntryDiagnosticsInfo) => {
      if (response && response.streamHealth.data.length) {
        // get the last report status as general status
        this._streamHealth.severity = response.streamHealth.data[0].severity;
      }
    })
  }

  private _startCalculatingStreamDurationTime() {
    this._streamDurationSubscription = Observable.timer(0, 1000)
      .subscribe(() => {
        if (this._dynamicInformation.streamStatus !== 'Offline') {
          if (this._dynamicInformation.streamCreationTime) {
            this._streamDuration = moment.duration(Math.abs(moment().diff(moment(this._dynamicInformation.streamCreationTime))));
          }
          else {
            this._streamDuration = moment.duration(0);
          }
        }
      });
  }

  public _getSourceHeight(): string {
    if (this._dynamicInformation.allStreams.primary) {
      let sourceStream = this._dynamicInformation.allStreams.primary.find(s => {
        return s.flavorId === environment.flavorsDefinitions.sourceFlavorId
      });

      return sourceStream ? `(${sourceStream.height}p)` : '';
    }
    else if (this._dynamicInformation.allStreams.secondary) {
      let sourceStream = this._dynamicInformation.allStreams.secondary.find(s => {
        return s.flavorId === environment.flavorsDefinitions.sourceFlavorId
      });

      return sourceStream ? `(${sourceStream.height}p)` : '';
    }
    else
      return '';
  }

  ngOnDestroy(): void {
    this._streamDurationSubscription.unsubscribe();
  }
}
