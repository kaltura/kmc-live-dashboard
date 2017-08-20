import { Component, OnInit } from '@angular/core';
import { LiveEntryService, ApplicationStatus, LiveEntryDynamicStreamInfo } from "../live-entry.service";
import { environment } from "../../environments/environment";

import 'rxjs/Rx';

@Component({
  selector: 'setup-and-preview',
  templateUrl: './setup-and-preview.component.html',
  styleUrls: ['./setup-and-preview.component.scss']
})

export class SetupAndPreviewComponent implements OnInit {

  public _applicationStatus: ApplicationStatus;
  public _dynamicInformation: LiveEntryDynamicStreamInfo;
  public _learnMoreLink = environment.externalLinks.LEARN_MORE;

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
  }

  /*public onClickSaveBtn(): void {
    this._liveEntryService.saveLiveStreamEntry();
  }*/
}
