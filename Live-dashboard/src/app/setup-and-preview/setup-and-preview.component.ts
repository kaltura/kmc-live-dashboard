import { Component, OnInit } from '@angular/core';
import { LiveEntryService, StreamStatus } from "../live-entry.service";

@Component({
  selector: 'setup-and-preview',
  templateUrl: './setup-and-preview.component.html',
  styleUrls: ['./setup-and-preview.component.scss']
})

export class SetupAndPreviewComponent implements OnInit {

  public _streamStatus: StreamStatus;

  constructor(public _liveEntryService : LiveEntryService) { }

  ngOnInit() {
    this._liveEntryService.streamStatus$.subscribe(response => {
      this._streamStatus = response;
    });
    this._liveEntryService.getStreamInfo();
  }

  public onClickSaveBtn(): void {
    this._liveEntryService.saveLiveStreamEntry();
  }
}
