import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { LiveEntryService } from "../services/live-entry.service";
import { LoadingStatus, LiveEntryDynamicStreamInfo } from "../types/live-dashboard.types";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'compact-dashboard',
  templateUrl: './compact-dashboard.component.html',
  styleUrls: ['./compact-dashboard.component.scss']
})
export class CompactDashboardComponent implements OnInit, OnDestroy {
  public  _applicationLoaded: boolean;
  private _applicationStatusSubscription: ISubscription;
  private _dynamicInformationSubscription: ISubscription;
  public  _dynamicInfo: LiveEntryDynamicStreamInfo = {
    redundancy: false,
    streamStatus: { state: 'Offline' },
    selfServe: false
  };

  @Input() colorsReverted = false;

  @Input() electronMode = false;

  constructor(private _liveEntryService: LiveEntryService) { }

  ngOnInit() {
    this._listenToApplicationStatus();
    this._subscribeToDynamicInformation();
  }

  ngOnDestroy() {
    this._applicationStatusSubscription.unsubscribe();
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
}
