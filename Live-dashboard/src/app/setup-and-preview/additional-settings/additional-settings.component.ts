import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { LiveEntryService } from "../../live-entry.service";

import * as _ from 'lodash';

declare type Recording = {
  enabled: boolean;
  type?: 'appendRecording' | 'newEntryPerSession';
}

@Component({
  selector: 'additional-settings',
  templateUrl: './additional-settings.component.html',
  styleUrls: ['./additional-settings.component.scss']
})
export class AdditionalSettingsComponent implements OnInit {
  conversionProfilesList: SelectItem[];
  selectedConversionProfile: number;
  dvr: boolean;
  recording: Recording;
  previewMode: boolean;

  constructor(private _liveEntryService: LiveEntryService) {
    this.conversionProfilesList = [];
    this.getConversionProfilesList();
  }

  ngOnInit() {
    this._liveEntryService.streamInfo$.subscribe(result => {
      if (result) {
        this.selectedConversionProfile = result.conversionProfileId;
        this.dvr = (result.dvrStatus);
        this.recording = this.parseRecordingConfiguration(result.recordingStatus);
        // TODO: Add support for Preview-Mode in backend API calls
      }
    });
  }

  private parseRecordingConfiguration(configured: number): Recording {
    switch (configured) {
      case 0:
        return { enabled: false };
      case 1:
        return { enabled: true, type: 'appendRecording' };
      case 2:
        return { enabled: true, type: 'newEntryPerSession' };
    }
  }

  private getConversionProfilesList() {
    this._liveEntryService.getConversionProfiles()
      .subscribe(result => {
        _.forEach(result, (cp) => {
          this.conversionProfilesList.push({ label: cp.name, value: cp.id });
        });
      })
  }
}
