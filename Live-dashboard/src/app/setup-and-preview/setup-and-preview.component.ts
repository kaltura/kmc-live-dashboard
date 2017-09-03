import { Component, OnInit } from '@angular/core';
import { LiveEntryService } from "../services/live-entry.service";
import { LiveEntryDynamicStreamInfo, LoadingStatus } from "../types/live-dashboard.types";
import { AreaBlockerMessage } from "@kaltura-ng/kaltura-ui";
import { AppLocalization } from "@kaltura-ng/kaltura-common";
import { environment } from "../../environments/environment";

import 'rxjs/Rx';

@Component({
  selector: 'setup-and-preview',
  templateUrl: './setup-and-preview.component.html',
  styleUrls: ['./setup-and-preview.component.scss']
})

export class SetupAndPreviewComponent implements OnInit {

  public _applicationLoaded: boolean;
  public _sectionBlockerMessage: AreaBlockerMessage;
  public _learnMoreLink = environment.externalLinks.LEARN_MORE;
  private _dynamicInformation: LiveEntryDynamicStreamInfo;

  constructor(private _liveEntryService: LiveEntryService,
              private _appLocalization: AppLocalization) {
    this._dynamicInformation = { streamStatus: 'Offline' };
  }

  ngOnInit() {
    this.listenToApplicationStatus();
    this.listenToDynamicStreamInfo();
  }

  private listenToApplicationStatus() {
    this._liveEntryService.applicationStatus$.subscribe(response => {
      if (response) {
        if (response.liveEntry === LoadingStatus.succeeded) {
          this._applicationLoaded = true;
          this._sectionBlockerMessage = null;
        }
        else if (response.liveEntry === LoadingStatus.failed) {
          this._sectionBlockerMessage = new AreaBlockerMessage({
            message: this._appLocalization.get('ERRORS.liveStream_get_failure'),
            buttons: [
              {
                label: 'retry',
                action: () => { this._liveEntryService.InitializeLiveEntryService(); }
              }
            ]
          });
        }
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
}
