import { Component, OnInit } from '@angular/core';
import {LiveEntryService} from "../../live-entry.service";

@Component({
  selector: 'basic-settings',
  templateUrl: 'basic-settings.component.html',
  styleUrls: ['basic-settings.component.scss']
})
export class BasicSettingsComponent implements OnInit {
  public entryName: string;
  public entryDescription : string;

  constructor(private _liveEntryService : LiveEntryService) { }

  ngOnInit() {
    this._liveEntryService.streamInfo$.subscribe(result => {
      if (result) {
        this.entryName = result.name;
        this.entryDescription = result.description;
      }
    });
  }
}
