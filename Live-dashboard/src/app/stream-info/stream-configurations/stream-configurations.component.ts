import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from "rxjs";
import { ISubscription } from "rxjs/Subscription";
import * as moment from 'moment';
import Duration = moment.Duration;

import { environment } from "../../../environments/environment"
import { LiveEntryService } from "../../services/live-entry.service";
import { AlertSeverity, LiveEntryDynamicStreamInfo, LiveEntryStaticConfiguration, LiveEntryDiagnosticsInfo } from "../../types/live-dashboard.types";


@Component({
  selector: 'stream-configurations',
  templateUrl: 'stream-configurations.component.html',
  styleUrls: ['stream-configurations.component.scss']
})
export class StreamConfigurationsComponent implements OnInit, OnDestroy {
  private _subscriptionsArray: ISubscription[] = [];
  public  _streamDuration: Duration;
  public  _staticConfiguration: LiveEntryStaticConfiguration;
  public  _dynamicInformation: LiveEntryDynamicStreamInfo;
  public  _streamHealth: {
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
    this._subscriptionsArray.push(this._liveEntryService.entryStaticConfiguration$.subscribe(response => {
      if (response) {
        this._staticConfiguration = response;
        this._startCalculatingStreamDurationTime();
      }
    }));
    this._subscriptionsArray.push(this._liveEntryService.entryDynamicInformation$.subscribe(response => {
      if (response) {
        this._dynamicInformation = response;
      }
    }));
    this._subscriptionsArray.push(this._liveEntryService.entryDiagnostics$.subscribe((response: LiveEntryDiagnosticsInfo) => {
      if (response && response.streamHealth.data.length) {
        // get the last report status as general status
        this._streamHealth.severity = response.streamHealth.data[0].severity;
      }
    }));
  }

  private _startCalculatingStreamDurationTime() {
    this._subscriptionsArray.push(Observable.timer(0, 1000)
      .subscribe(() => {
        if (this._dynamicInformation.streamStatus !== 'Offline') {
          if (this._dynamicInformation.streamCreationTime) {
            this._streamDuration = moment.duration(Math.abs(moment().diff(moment(this._dynamicInformation.streamCreationTime))));
          }
          else {
            this._streamDuration = moment.duration(0);
          }
        }
      }));
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

  ngOnDestroy() {
    this._subscriptionsArray.forEach(s => s.unsubscribe() );
  }
}
