import { environment } from "../../../environments/environment";
import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { LiveEntryService } from "../../services/live-entry.service";
import { LiveEntryDynamicStreamInfo, Alert, DiagnosticsErrorCodes } from "../../types/live-dashboard.types";
import { ISubscription } from "rxjs/Subscription";
import { KalturaEntryServerNodeType } from "kaltura-ngx-client/api/types/KalturaEntryServerNodeType";
import { AppLocalization } from "@kaltura-ng/kaltura-common";
import { KalturaNullableBoolean } from "kaltura-ngx-client/api/types/KalturaNullableBoolean";

@Component({
  selector: 'further-information',
  templateUrl: './further-information.component.html',
  styleUrls: ['./further-information.component.scss']
})
export class FurtherInformationComponent implements OnInit, OnDestroy {
  private _liveStreamSubscription: ISubscription;
  public  _dynamicInformation: LiveEntryDynamicStreamInfo;
  private _dynamicInformationSubscription: ISubscription;
  public  _explicitLive = false;
  public  _learnMoreLink = environment.externalLinks.LEARN_MORE;
  private _diagnosticsSubscription: ISubscription;
  public  _alertsArray: Alert[] = [];
  public  _alertIndex: number = 0;
  private _alertsToIgnore: DiagnosticsErrorCodes[] = [DiagnosticsErrorCodes.EntryStarted, DiagnosticsErrorCodes.EntryStopped, DiagnosticsErrorCodes.BackupOnlyStreamNoRecording];

  @Input() colorsReverted = false;

  @Input() electronMode = false;

  constructor(private _liveEntryService: LiveEntryService, private _appLocalization: AppLocalization) {
    this._dynamicInformation = {
      streamStatus: {
        state: 'Offline'
      }
    };
  }

  ngOnInit() {
    this._listenToLiveStream();
    this._listenToDynamicStreamInfo();
    this._listenToHealthDiagnostics();
  }

  ngOnDestroy() {
    this._liveStreamSubscription.unsubscribe();
    this._dynamicInformationSubscription.unsubscribe();
    this._diagnosticsSubscription.unsubscribe();
  }

  private _listenToLiveStream(): void {
    this._liveStreamSubscription = this._liveEntryService.liveStream$.subscribe(response => {
      this._explicitLive = response.explicitLive === KalturaNullableBoolean.trueValue;
    });
  }

  private _listenToDynamicStreamInfo(): void {
    this._dynamicInformationSubscription = this._liveEntryService.entryDynamicInformation$.subscribe(response => {
      if (response) {
        this._dynamicInformation = response;
      }
    });
  }

  private _listenToHealthDiagnostics(): void {
    this._diagnosticsSubscription = this._liveEntryService.entryDiagnostics$.subscribe(response => {
      if (response && this._dynamicInformation.streamStatus.serverType) {
        if (KalturaEntryServerNodeType.livePrimary === this._dynamicInformation.streamStatus.serverType
          && response.streamHealth.data.primary.length
          && response.streamHealth.data.primary[0].updatedTime > this._dynamicInformation.streamSession.timerStartTime) {
          this._alertsArray = response.streamHealth.data.primary[0].alerts.filter(alert => !this._alertsToIgnore.includes(alert.Code));
          this._alertIndex = 0;
        }
        else if (KalturaEntryServerNodeType.liveBackup === this._dynamicInformation.streamStatus.serverType
          && response.streamHealth.data.secondary.length
          && response.streamHealth.data.secondary[0].updatedTime > this._dynamicInformation.streamSession.timerStartTime) {
          this._alertsArray = response.streamHealth.data.secondary[0].alerts.filter(alert => !this._alertsToIgnore.includes(alert.Code));
          this._alertIndex = 0;
        }
      }
    })
  }

  public _onClickLearnMore(): void {
    if (this.electronMode) {
      window.parent.postMessage({ type: 'onUrlOpen', content: this._learnMoreLink }, '*');
    }
    else {
      window.open(this._learnMoreLink, '_blank');
    }
  }

  public _onClickLeftArrow(): void {
    if (this._alertIndex > 0) {
      this._alertIndex--;
    }
  }

  public _onClickRightArrow(): void {
    if (this._alertIndex < this._alertsArray.length - 1) {
      this._alertIndex++;
    }
  }

  public _getStreamLiveMessage(): string {
    return this._explicitLive ? this._appLocalization.get('DASHBOARD.explicit_live.stream_is_live_message') : this._appLocalization.get('DASHBOARD.stream_is_live_message');
  }
}
