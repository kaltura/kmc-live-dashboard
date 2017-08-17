import { Component, OnInit } from '@angular/core';
import { LiveEntryService, ApplicationStatus } from "../live-entry.service";

import 'rxjs/Rx';

@Component({
  selector: 'setup-and-preview',
  templateUrl: './setup-and-preview.component.html',
  styleUrls: ['./setup-and-preview.component.scss']
})

export class SetupAndPreviewComponent implements OnInit {

  public _applicationStatus: ApplicationStatus;

  constructor(public _liveEntryService : LiveEntryService) { }

  ngOnInit() {
    this._liveEntryService.applicationStatus$.subscribe(response => {
      this._applicationStatus = response;
    });
    this._liveEntryService.getLiveEntryInformation();
    this._liveEntryService.runEntryStatusMonitoring();
    this._liveEntryService.runStreamHealthMonitoring();
  }

  public onClickSaveBtn(): void {
    this._liveEntryService.saveLiveStreamEntry();
  }
}
