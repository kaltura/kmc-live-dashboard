import { Component, OnInit } from '@angular/core';
import { BootstrapService } from "./bootstrap.service";
import { LiveEntryService } from "./services/live-entry.service";
import { AreaBlockerMessage } from "@kaltura-ng/kaltura-ui";
import { LoadingStatus } from "./types/live-dashboard.types";
import { LiveDashboardConfiguration } from "./services/live-dashboard-configuration.service";
import { environment } from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public _applicationLoading = true;
  public _applicationLoaded = false;
  public _sectionBlockerMessage: AreaBlockerMessage;
  public _configuration = { version: '' };

  constructor(private _bootstrapService: BootstrapService,
              private _liveEntryService: LiveEntryService,
              private _liveDashboardConfiguration: LiveDashboardConfiguration) {
  }

  ngOnInit() {
    this._bootstrapService.initialize().subscribe(() => {
        const appStatusSubscription = this._liveEntryService.applicationStatus$.subscribe(status => {
            if ((status.liveEntry === LoadingStatus.succeeded) &&
                (status.streamHealth === LoadingStatus.succeeded)) {
              this._applicationLoading = false;
              this._applicationLoaded = true;
              appStatusSubscription.unsubscribe();
            }
          });
        // TODO on error also run _liveEntryService.stopAutomaticDataPull()
        this._liveEntryService.InitializeLiveEntryService();
        this._configuration.version = this._liveDashboardConfiguration.version;
      },
      (error) => {
        this._applicationLoading = false;
        this._sectionBlockerMessage = new AreaBlockerMessage({
          message: environment.bootstrap.parameters_error,
          buttons: []
        });
      });
  }
}
