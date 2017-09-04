import { Component, OnDestroy, OnInit } from '@angular/core';
import { LiveEntryService } from "../services/live-entry.service";
import { LiveEntryDynamicStreamInfo, LoadingStatus } from "../types/live-dashboard.types";
import { ISubscription } from "rxjs/Subscription";
import { environment } from "../../environments/environment";

import 'rxjs/Rx';

@Component({
  selector: 'setup-and-preview',
  templateUrl: './setup-and-preview.component.html',
  styleUrls: ['./setup-and-preview.component.scss']
})

export class SetupAndPreviewComponent implements OnInit, OnDestroy {
  public  _applicationLoaded: boolean;
  private _applicationStatusSubscription: ISubscription;
  public  _learnMoreLink = environment.externalLinks.LEARN_MORE;
  public  _dynamicInformation: LiveEntryDynamicStreamInfo;
  private _dynamicInformationSubscription: ISubscription;

  constructor(private _liveEntryService: LiveEntryService) {
    this._dynamicInformation = { streamStatus: 'Offline' };
  }

  ngOnInit() {
    this.listenToApplicationStatus();
    this.listenToDynamicStreamInfo();
  }

  ngOnDestroy() {
    this._applicationStatusSubscription.unsubscribe();
    this._dynamicInformationSubscription.unsubscribe();
  }

  private listenToApplicationStatus() {
    this._applicationStatusSubscription = this._liveEntryService.applicationStatus$
      .subscribe(response => {
        if (response) {
          this._applicationLoaded = (response.liveEntry === LoadingStatus.succeeded) &&
                                    (response.streamStatus === LoadingStatus.succeeded) &&
                                    (response.streamHealth === LoadingStatus.succeeded)
        }
    });
  }

  private listenToDynamicStreamInfo() {
    this._dynamicInformationSubscription = this._liveEntryService.entryDynamicInformation$.subscribe(response => {
      if (response) {
        this._dynamicInformation = response;
      }
    });
  }
}
