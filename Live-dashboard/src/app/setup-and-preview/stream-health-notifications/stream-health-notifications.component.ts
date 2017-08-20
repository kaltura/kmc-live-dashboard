import { Component, OnInit } from '@angular/core';
import {LiveEntryService, LiveEntryDiagnosticsInfo, LiveEntryDynamicStreamInfo} from "../../live-entry.service";

@Component({
  selector: 'stream-health-notifications',
  templateUrl: './stream-health-notifications.component.html',
  styleUrls: ['./stream-health-notifications.component.scss']
})
export class StreamHealthNotificationsComponent implements OnInit {

  public streamHealthNotifications = [];
  private lastNotificationItem = null;

  constructor(private _liveEntryService: LiveEntryService) {}

  ngOnInit() {
    this.listenToEntryDiagnosticsNotifications();
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
          this.streamHealthNotifications.push(item);
        }
      }
    });
  }
}
