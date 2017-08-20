import { Component, OnInit } from '@angular/core';
import {LiveEntryService, StreamStatus, LiveEntryDynamicStreamInfo} from "../live-entry.service";

import 'rxjs/Rx';

@Component({
  selector: 'setup-and-preview',
  templateUrl: './setup-and-preview.component.html',
  styleUrls: ['./setup-and-preview.component.scss']
})

export class SetupAndPreviewComponent implements OnInit {

  public _applicationStatus: StreamStatus;
  private _dynamicConfiguration: LiveEntryDynamicStreamInfo;

  constructor(public _liveEntryService : LiveEntryService) { }

  ngOnInit() {
    this._liveEntryService.applicationStatus$.subscribe(response => {
      this._applicationStatus = response;
    });
    this._liveEntryService.getLiveEntryInformation();   // static
    this._liveEntryService.runEntryStatusMonitoring();  // dynamic
    this._liveEntryService.runStreamHealthMonitoring(); // diagnostics

    this.listenToDynamicStreamInfo();
  }

  public onClickSaveBtn(): void {
    this._liveEntryService.saveLiveStreamEntry();
  }

  private listenToDynamicStreamInfo() {
    this._liveEntryService.entryDynamicConfiguration$.subscribe(response => {
      if (response) {
        this._dynamicConfiguration = response;
      }
    });
  }
}
