import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from "rxjs";
import { ISubscription } from "rxjs/Subscription";
import * as moment from 'moment';
import Duration = moment.Duration;
import { environment } from "../../../environments/environment"
import { LiveEntryService } from "../../services/live-entry.service";
import {
  AlertSeverity, LiveEntryDynamicStreamInfo, LiveEntryStaticConfiguration, LiveEntryDiagnosticsInfo,
  FlavorObject, NodeStreams
} from "../../types/live-dashboard.types";
import { KalturaEntryServerNodeType } from "kaltura-typescript-client/types/KalturaEntryServerNodeType";
import { AppLocalization } from "@kaltura-ng/kaltura-common";


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
  public  _streamHealthTooltip: string = "";
  public  _allStreams: NodeStreams;
  public  _streamSeverity: AlertSeverity;

  constructor(private _liveEntryService: LiveEntryService, private _appLocalization: AppLocalization) {
    // Static configuration
    this._staticConfiguration = {
      dvr: false,
      recording: false,
      transcoding: false
    };
    // Dynamic configuration
    this._dynamicInformation = {
      redundancy: false,
      streamStatus: {
        state: 'Offline'
      }
    };
    this._allStreams = { primary: [], secondary: [] };
    this._streamSeverity = AlertSeverity.info;
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
    this._startStreamHealthSubscription();
    this._buildStreamHealthToolTip();
  }

  private _startStreamHealthSubscription(): void {
    this._subscriptionsArray.push(this._liveEntryService.entryDiagnostics$.subscribe((response: LiveEntryDiagnosticsInfo) => {
      if (response) {
        this._getStreamsFlavors(response);
        this._getStreamsSeverity(response);
      }
    }));
  }

  private _getStreamsFlavors(diagnostics: LiveEntryDiagnosticsInfo): void {
    if (diagnostics.dynamicInfoPrimary.data) {
      this._allStreams.primary = diagnostics.dynamicInfoPrimary.data.flavors;
    }
    if (diagnostics.dynamicInfoSecondary.data) {
      this._allStreams.secondary = diagnostics.dynamicInfoSecondary.data.flavors;
    }
  }

  private _getStreamsSeverity(diagnostics: LiveEntryDiagnosticsInfo): void {
    if (KalturaEntryServerNodeType.livePrimary.equals(this._dynamicInformation.streamStatus.serverType)) {
      if (diagnostics.streamHealth.data.primary.length) {
        // get the last report status as general status
        this._streamSeverity = diagnostics.streamHealth.data.primary[0].severity;
      }
    }
    else {
      if (diagnostics.streamHealth.data.secondary.length) {
        // get the last report status as general status
        this._streamSeverity = diagnostics.streamHealth.data.secondary[0].severity;
      }
    }
  }

  private _startCalculatingStreamDurationTime(): void {
    this._subscriptionsArray.push(Observable.timer(0, 1000)
      .subscribe(() => {
        if (this._dynamicInformation.streamStatus.state !== 'Offline') {
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
    let flavorsArray: FlavorObject[] = [];
    if (KalturaEntryServerNodeType.livePrimary.equals(this._dynamicInformation.streamStatus.serverType)) {
      flavorsArray = this._allStreams.primary;
    }
    else if (KalturaEntryServerNodeType.liveBackup.equals(this._dynamicInformation.streamStatus.serverType)) {
      flavorsArray = this._allStreams.secondary;
    }

    if (flavorsArray.length) {
      let source = flavorsArray.find(f => { return f.name === environment.flavorsDefinitions.sourceFlavorId });

      return source? `(${source.mediaInfo.resolution[1]}p)` : '';
    }

    return '';
  }

  private _buildStreamHealthToolTip(): void {
    function alignTooltipLeft(text: string): string {
      return `<div class=alignLeft>${text}</div>`;
    }

    let lineGood = alignTooltipLeft(`<i class='kIconpartial_small bullet-green'></i> <b>${this._appLocalization.get('STREAM_CONFIG.stream_health.state.Good')}</b>: ${this._appLocalization.get('STREAM_CONFIG.stream_health.tooltip.Good')}`);
    let lineFair = alignTooltipLeft(`<i class='kIconpartial_small bullet-yellow'></i> <b>${this._appLocalization.get('STREAM_CONFIG.stream_health.state.Fair')}</b>: ${this._appLocalization.get('STREAM_CONFIG.stream_health.tooltip.Fair')}`);
    let linePoor = alignTooltipLeft(`<i class='kIconpartial_small bullet-red'></i> <b>${this._appLocalization.get('STREAM_CONFIG.stream_health.state.Poor')}</b>: ${this._appLocalization.get('STREAM_CONFIG.stream_health.tooltip.Poor')}`);
    let lineNA = alignTooltipLeft(`<i class='kIconpartial_small bullet-grey'></i> <b>${this._appLocalization.get('STREAM_CONFIG.stream_health.state.N/A')}</b>: ${this._appLocalization.get('STREAM_CONFIG.stream_health.tooltip.N/A')}`);

    this._streamHealthTooltip = lineGood + lineFair + linePoor + lineNA;
  }

  ngOnDestroy() {
    this._subscriptionsArray.forEach(s => s.unsubscribe());
  }
}
