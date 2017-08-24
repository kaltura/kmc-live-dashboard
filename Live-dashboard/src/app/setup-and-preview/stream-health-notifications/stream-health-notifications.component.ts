import { Component, OnInit } from '@angular/core';
import { LiveEntryService, LiveEntryDiagnosticsInfo } from "../../live-entry.service";
import { LiveEntryTimerTaskService } from "../../entry-timer-task.service";
import * as _ from 'lodash';

@Component({
  selector: 'stream-health-notifications',
  templateUrl: './stream-health-notifications.component.html',
  styleUrls: ['./stream-health-notifications.component.scss']
})
export class StreamHealthNotificationsComponent implements OnInit {

  public streamHealthNotifications = [];
  public _numOfWatchers = 0;

  constructor(private _liveEntryService: LiveEntryService, private _entryTimerTask: LiveEntryTimerTaskService) {}

  ngOnInit() {
    this._numOfWatchers = 0;
    this.listenToEntryDiagnosticsNotifications();

    this._liveEntryService.numOfWatcher$
      .subscribe((res) => {

        if (res && _.isArray(res) && res.length > 0 && res[0].data){
          let watchers = res[0].data.split(';');
          let numOfWatchers = 0;

          _.forEachRight(watchers, (watcher) => {
            let watcherParam = watcher.split(',');
            numOfWatchers = (parseInt(watcherParam[1]) || 0 ) + (parseInt(watcherParam[2]) || 0 );  // live + dvr

            if (numOfWatchers > 0){
              return false;
            }
          });

          this._numOfWatchers = numOfWatchers;
        }
      });
  }

  private listenToEntryDiagnosticsNotifications() {
    let item;
    let notifications;

    this._liveEntryService.entryDiagnostics$.subscribe((diagnostic: LiveEntryDiagnosticsInfo) => {
      if (diagnostic && diagnostic.streamHealth && diagnostic.streamHealth) {

        //debugger;
        notifications = [];
        // _.each(diagnostic.streamHealth.alerts, (alert: Alert) => {
        //   item = {
        //     time: alert.time.valueOf(),
        //     health: alert.health,
        //     errorCode: alert.errorCode,
        //     shortDescription: 'short Description',
        //     longDescription: 'long long long long long Description'
        //   };
        //
        //   notifications.push(item);
        // });

        this.streamHealthNotifications = notifications;
        // end _.each
      }
    });
  }

}
