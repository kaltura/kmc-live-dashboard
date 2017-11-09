import { Component, OnDestroy, OnInit } from '@angular/core';
import { LiveEntryService } from "../services/live-entry.service";
import { LoadingStatus } from "../types/live-dashboard.types";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'compact-dashboard',
  templateUrl: './compact-dashboard.component.html',
  styleUrls: ['./compact-dashboard.component.scss']
})
export class CompactDashboardComponent implements OnInit, OnDestroy {
  public  _applicationLoaded: boolean;
  private _applicationStatusSubscription: ISubscription;

  constructor(private _liveEntryService: LiveEntryService) { }

  ngOnInit() {
    this._listenToApplicationStatus();
  }

  ngOnDestroy() {
    this._applicationStatusSubscription.unsubscribe();
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
}
