import { environment } from "../../../environments/environment";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LiveEntryService } from "../../services/live-entry.service";
import { LiveEntryDynamicStreamInfo, Alert } from "../../types/live-dashboard.types";
import { ISubscription } from "rxjs/Subscription";
import { KalturaEntryServerNodeType } from "kaltura-typescript-client/types/KalturaEntryServerNodeType";

@Component({
  selector: 'further-information',
  templateUrl: './further-information.component.html',
  styleUrls: ['./further-information.component.scss']
})
export class FurtherInformationComponent implements OnInit, OnDestroy {
  public  _dynamicInformation: LiveEntryDynamicStreamInfo;
  private _dynamicInformationSubscription: ISubscription;
  public  _learnMoreLink = environment.externalLinks.LEARN_MORE;
  private _diagnosticsSubscription: ISubscription;
  public  _alertsArray: Alert[] = [];
  public  _alertIndex: number = 0;

  constructor(private _liveEntryService: LiveEntryService) {
    this._dynamicInformation = {
      streamStatus: {
        state: 'Offline'
      }
    };
  }

  ngOnInit() {
    this._listenToDynamicStreamInfo();
    this._listenToHealthDiagnostics();
  }

  ngOnDestroy() {
    this._dynamicInformationSubscription.unsubscribe();
    this._diagnosticsSubscription.unsubscribe();
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
        if (KalturaEntryServerNodeType.livePrimary.equals(this._dynamicInformation.streamStatus.serverType) && response.streamHealthPrimary.data.length) {
          this._alertsArray = response.streamHealthPrimary.data[0].alerts;
          this._alertIndex = 0;
        }
        else if (KalturaEntryServerNodeType.liveBackup.equals(this._dynamicInformation.streamStatus.serverType) && response.streamHealthSecondary.data.length) {
          this._alertsArray = response.streamHealthSecondary.data[0].alerts;
          this._alertIndex = 0;
        }
      }
    })
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
}
