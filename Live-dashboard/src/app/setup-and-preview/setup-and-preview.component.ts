import { Component, OnInit } from '@angular/core';
import { LiveEntryService, ApplicationStatus, LiveEntryDynamicStreamInfo, LoadingStatus } from "../live-entry.service";
import { TranslateService } from "ng2-translate";
import { AreaBlockerMessage } from "@kaltura-ng/kaltura-ui";
import { environment } from "../../environments/environment";

import 'rxjs/Rx';

@Component({
  selector: 'setup-and-preview',
  templateUrl: './setup-and-preview.component.html',
  styleUrls: ['./setup-and-preview.component.scss']
})

export class SetupAndPreviewComponent implements OnInit {

  public _applicationStatus: ApplicationStatus;
  private _dynamicInformation: LiveEntryDynamicStreamInfo;
  public _sectionBlockerMessage: AreaBlockerMessage;
  public _learnMoreLink = environment.externalLinks.LEARN_MORE;

  constructor(public _liveEntryService : LiveEntryService, private _translate: TranslateService) {
    this._dynamicInformation = { streamStatus: 'Offline' };
  }

  ngOnInit() {
    this.listenToApplicationStatus();
    this.listenToDynamicStreamInfo();
  }

  private listenToApplicationStatus() {
    this._liveEntryService.applicationStatus$.subscribe(response => {
      if (response) {
        this._applicationStatus = response;
      }
    });
  }

  private listenToDynamicStreamInfo() {
    this._liveEntryService.entryDynamicInformation$.subscribe(response => {
      if (response) {
        this._dynamicInformation = response;
      }
    });
  }

  public _applicationLoaded(): boolean {
    // if (this._applicationStatus.liveEntry === LoadingStatus.succeeded &&
    //     this._applicationStatus.streamStatus === LoadingStatus.succeeded &&
    //     this._applicationStatus.streamHealth === LoadingStatus.succeeded) {
    //   return false;
    // }
    // else if (this._applicationStatus.liveEntry === LoadingStatus.failed) {
    //   this._sectionBlockerMessage = new AreaBlockerMessage({
    //     message: this._translate.instant(environment.loadingError.liveEntryFailed),
    //     buttons: []
    //   });
    //   return false;
    // }
    return false;
  }
}
