import {Component, OnInit, OnDestroy} from '@angular/core';
import {LiveEntryService, LiveEntryDiagnosticsInfo, LiveEntryDynamicStreamInfo} from "../../live-entry.service";
import {Subscription, Observable} from "rxjs";
import {LiveEntryTimerTaskService} from "../../entry-timer-task.service";
import * as _ from 'lodash';

@Component({
  selector: 'stream-health-notifications',
  templateUrl: './stream-health-notifications.component.html',
  styleUrls: ['./stream-health-notifications.component.scss']
})
export class StreamHealthNotificationsComponent implements OnInit {

  public streamHealthNotifications = [];
  private lastNotificationItem = null;
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
    this._liveEntryService.entryDiagnostics$.subscribe((diagnostic: LiveEntryDiagnosticsInfo) => {
      if (diagnostic) {

        // If there is a really new health status notification change -> add it to list
        if (this.lastNotificationItem == null || this.lastNotificationItem.health !== diagnostic.streamHealth.health) {
          let item = {
            time: diagnostic.streamHealth.updatedTime,
            health: diagnostic.streamHealth.health,
            shortDescription: 'short Description',
            longDescription: 'long long long long long Description'
          };

          this.lastNotificationItem = item;
          this.streamHealthNotifications.unshift(item); // push item to the first position of the array.
        }
      }
    });
  }


}
