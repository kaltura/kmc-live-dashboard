import { Component, OnInit } from '@angular/core';
import { LiveEntryService, ApplicationStatus, LiveEntryDynamicStreamInfo } from "../live-entry.service";

import 'rxjs/Rx';

@Component({
  selector: 'setup-and-preview',
  templateUrl: './setup-and-preview.component.html',
  styleUrls: ['./setup-and-preview.component.scss']
})

export class SetupAndPreviewComponent implements OnInit {

  public _applicationStatus: ApplicationStatus;
  public _dynamicInformation: LiveEntryDynamicStreamInfo;


  constructor(public _liveEntryService : LiveEntryService) {
    this._applicationStatus = { status: 'initial' };
    this._dynamicInformation = { streamStatus: 'Offline' };
  }

  ngOnInit() {
    this._liveEntryService.applicationStatus$.subscribe(response => {
       if(response) {
         this._applicationStatus = response;
       }
    });
    this._liveEntryService.entryDynamicInformation$.subscribe(response => {
      if (response) {
        this._dynamicInformation.streamStatus = response.streamStatus;
      }
    });
    this._liveEntryService.getLiveEntryInformation();
    this._liveEntryService.runEntryStatusMonitoring();
    this._liveEntryService.runStreamHealthMonitoring();
  }

  public onClickSaveBtn(): void {
    this._liveEntryService.saveLiveStreamEntry();
  }
}
