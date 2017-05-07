import { Component, OnInit } from '@angular/core';
import { LiveEntryService } from '../../live-entry.service';

@Component({
  selector: 'encoder-settings',
  templateUrl: 'encoder-settings.component.html',
  styleUrls: ['encoder-settings.component.scss']
})
export class EncoderSettingsComponent implements OnInit {
  primaryUrl: string = "";
  secondaryUrl: string = "";
  streamName: string = "";

  constructor(private _liveEntryService : LiveEntryService) { }

  ngOnInit() {
    this._liveEntryService.streamInfo$.subscribe(result => {
      if (result) {
        this.primaryUrl = result.encoderSettings.primaryUrl;
        this.secondaryUrl = result.encoderSettings.secondaryUrl;
        this.streamName = result.encoderSettings.stream;
      }
    });
  }
}
