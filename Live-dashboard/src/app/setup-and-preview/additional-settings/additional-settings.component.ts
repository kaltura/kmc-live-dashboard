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
  _conversionProfilesList: SelectItem[];
  _selectedConversionProfile: number;
  _dvr: boolean;
  _recording: Recording;
  _previewMode: boolean;

  constructor(private _liveEntryService: LiveEntryService) {
    this._conversionProfilesList = [];
    this._getConversionProfilesList();
  }

  ngOnInit() {
    this._liveEntryService.streamInfo$.subscribe(result => {
      if (result) {
        this._selectedConversionProfile = result.conversionProfileId;
        this._dvr = (result.dvrStatus);
        this._recording = this._parseRecordingConfiguration(result.recordingStatus);
        // TODO: Add support for Preview-Mode in backend API calls
      }
    });
  }

  private _parseRecordingConfiguration(configured: number): Recording {
    switch (configured) {
      case 0:
        return { enabled: false };
      case 1:
        return { enabled: true, type: 'appendRecording' };
      case 2:
        return { enabled: true, type: 'newEntryPerSession' };
    }
  }

  private _getConversionProfilesList(): void {
    this._liveEntryService.getConversionProfiles()
      .subscribe(result => {
        _.forEach(result, (cp) => {
          this._conversionProfilesList.push({ label: cp.name, value: cp.id });
        });
      })
  }

  public _onClickRecordingCheck(): void {
    if (!this._recording.enabled && this._recording.type) {
      delete this._recording.type;
    }
    debugger;
  }
}
