import { Component, OnInit } from '@angular/core';
import { LiveEntryService } from "../live-entry.service";

@Component({
  selector: 'setup-and-preview',
  templateUrl: './setup-and-preview.component.html',
  styleUrls: ['./setup-and-preview.component.scss']
})

export class SetupAndPreviewComponent implements OnInit {

  public status: string;

  constructor(private _liveEntryService : LiveEntryService) { }

  ngOnInit() {
    this._liveEntryService.streamStatus$.subscribe(result => {
      this.status = result.status;
    });
    this._liveEntryService.getStreamInfo();
  }

}
