import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { LiveEntryService } from "../services/live-entry.service";
import { LoadingStatus, PlayerConfig, LiveEntryDynamicStreamInfo } from "../types/live-dashboard.types";
import { ISubscription } from "rxjs/Subscription";
import { LiveDashboardConfiguration } from "../services/live-dashboard-configuration.service";

@Component({
  selector: 'compact-dashboard',
  templateUrl: './compact-dashboard.component.html',
  styleUrls: ['./compact-dashboard.component.scss']
})
export class CompactDashboardComponent implements OnInit, OnDestroy {
  public  _applicationLoaded: boolean;
  private _applicationStatusSubscription: ISubscription;
  private _liveStreamSubscription: ISubscription;
  private _dynamicInformationSubscription: ISubscription;
  public  _playerConfig: PlayerConfig = {};
  public  _dynamicInfo: LiveEntryDynamicStreamInfo = {
    redundancy: false,
    streamStatus: 'Offline'
  };

  @Input() colorsReverted = false;

  @Input() electronMode = false;

  constructor(private _liveEntryService: LiveEntryService,
              private _liveDashboardConfiguration: LiveDashboardConfiguration) { }

  ngOnInit() {
    this._listenToApplicationStatus();
    this._subscribeToLiveStream();
    this._subscribeToDynamicInformation();
  }

  ngOnDestroy() {
    this._applicationStatusSubscription.unsubscribe();
    this._liveStreamSubscription.unsubscribe();
    this._dynamicInformationSubscription.unsubscribe();
  }

  private _listenToApplicationStatus(): void {
    this._applicationStatusSubscription = this._liveEntryService.applicationStatus$
      .subscribe(response => {
        if (response) {
          this._applicationLoaded = (response.liveEntry === LoadingStatus.succeeded) &&
            (response.streamStatus === LoadingStatus.succeeded) &&
            (response.streamHealth === LoadingStatus.succeeded)
        }
      });
  }

  private _subscribeToDynamicInformation(): void {
    this._dynamicInformationSubscription = this._liveEntryService.entryDynamicInformation$.subscribe(response => {
      if (response) {
        this._dynamicInfo = response;
      }
    });
  }

  private _subscribeToLiveStream(): void {
    this._liveStreamSubscription = this._liveEntryService.liveStream$.subscribe(response => {
      if (response) {
        this._playerConfig.partnerId = response.partnerId;
        this._playerConfig.entryId = response.id;
        this._playerConfig.ks = this._liveDashboardConfiguration.ks;
        this._playerConfig.uiConfId = this._liveDashboardConfiguration.uiConfId;
        this._playerConfig.serviceUrl = this._liveDashboardConfiguration.service_url;
        this._playerConfig.flashVars = {
          SkipKSOnIsLiveRequest: false,
          ks: this._playerConfig.ks
        };
      }
    });
  }
}
