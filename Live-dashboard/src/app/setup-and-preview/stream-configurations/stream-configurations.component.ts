import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import * as moment from 'moment';
import Duration = moment.Duration;

import { LiveEntryService, LiveStreamStatusEnum, LiveEntryStaticConfiguration, LiveEntryDynamicStreamInfo } from "../../live-entry.service";
import {EntryDynamicInformationPipe} from "../../../pipes/entry-dynamic-information.pipe";

@Component({
  selector: 'stream-configurations',
  templateUrl: 'stream-configurations.component.html',
  styleUrls: ['stream-configurations.component.scss']
})
export class StreamConfigurationsComponent implements OnInit, OnDestroy{

  public _streamDuration: Duration;
  private _streamDurationSubscription: Subscription;
  public _staticConfiguration: LiveEntryStaticConfiguration;
  public _dynamicConfiguration: LiveEntryDynamicStreamInfo;


  constructor(private _liveEntryService: LiveEntryService,
              private entryDynamicInformationPipe: EntryDynamicInformationPipe) {
    this._staticConfiguration = {
      dvr: false,
      recording: false,
      transcoding: false
    };

    this._dynamicConfiguration = {
      redundancy: false,
      streamStatus: LiveStreamStatusEnum.Offline,
      streamStartTime: 0
    };
  }

  ngOnInit() {
    this._liveEntryService.entryStaticConfiguration$.subscribe(response => {
      if (response) {
        this._staticConfiguration = response;
        this.startCalculatingStreamDurationTime();
      }
    });
    this._liveEntryService.entryDynamicConfiguration$.subscribe(response => {
      if (response) {
        this._dynamicConfiguration = response;
      }
    });
  }

  private startCalculatingStreamDurationTime() {
    this._streamDurationSubscription = Observable.timer(0, 1000)
      .subscribe(() => {
        let streamStatus = this.entryDynamicInformationPipe.transform(this._dynamicConfiguration.streamStatus);
        if (streamStatus !== 'Offline'){
          if (this._dynamicConfiguration.streamCreationTime){
            this._streamDuration = moment.duration(Math.abs(moment().diff(moment(this._dynamicConfiguration.streamCreationTime))));
          }
          else{
            this._streamDuration = moment.duration(0);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this._streamDurationSubscription.unsubscribe();
  }
}
