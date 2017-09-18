import { Component, OnDestroy, OnInit } from '@angular/core';
import { LiveEntryService } from "../../services/live-entry.service";
import * as _ from 'lodash';
import { StreamHealth } from "../../types/live-dashboard.types";
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'stream-health-notifications',
  templateUrl: './stream-health-notifications.component.html',
  styleUrls: ['./stream-health-notifications.component.scss']
})
export class StreamHealthNotificationsComponent implements OnInit, OnDestroy {
  private _entryDiagnosticsSubscription: ISubscription;
  private _numOfWatchersSubscription: ISubscription;
  public  _numOfWatchers = 0;
  public  streamHealthNotifications = [];

  constructor(private _liveEntryService: LiveEntryService) {}

  ngOnInit() {
    this._numOfWatchers = 0;
    this._listenToEntryDiagnosticsNotifications();

    this._numOfWatchersSubscription = this._liveEntryService.numOfWatcher$
      .subscribe((response) => {
        if (response && response.length > 0 && response[0].data) {
          // response.data[0] is an array string, where each element is separated by ';'
          // Each element contains three numbers: time, num of live watchers, num of dvr watchers
          let watchers = response[0].data.split(';');
          let audience = 0;
          // Display the max num of watchers in 90 sec window
          _.forEach(watchers, watcher => {
            let watcherParam = watcher.split(',');
            let tmpAudience = (parseInt(watcherParam[1]) || 0 ) + (parseInt(watcherParam[2]) || 0 );  // live + dvr
            audience = (tmpAudience > audience) ? tmpAudience : audience;
          });

          this._numOfWatchers = audience;
        }
      });
  }

  ngOnDestroy() {
    this._numOfWatchersSubscription.unsubscribe();
    this._entryDiagnosticsSubscription.unsubscribe();
  }

  private _listenToEntryDiagnosticsNotifications() {
    this._entryDiagnosticsSubscription = this._liveEntryService.entryDiagnostics$.subscribe(response => {
      if (response && response.streamHealthPrimary.data.length) {
        this.streamHealthNotifications = response.streamHealthPrimary.data.concat(this.streamHealthNotifications);
      }
      if (response && response.streamHealthSecondary.data.length) {
        this.streamHealthNotifications = response.streamHealthSecondary.data.concat(this.streamHealthNotifications);
      }
      this.streamHealthNotifications.sort(this._sortHealthNotifications);
    });
  }

  private _sortHealthNotifications(a: StreamHealth, b: StreamHealth) {
    if (a.updatedTime > b.updatedTime) {
      return -1;
    }
    if (a.updatedTime < b.updatedTime) {
      return 1
    }
    return 0;
  }
}
