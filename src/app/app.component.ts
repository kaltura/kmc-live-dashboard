import { Component, OnInit } from '@angular/core';
import { BootstrapService } from "./bootstrap.service";
import { LiveEntryService } from "./services/live-entry.service";
import { AreaBlockerMessage } from "@kaltura-ng/kaltura-ui";
import { LoadingStatus } from "./types/live-dashboard.types";
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

  constructor(private _bootstrapService: BootstrapService,
              private _liveEntryService: LiveEntryService) {
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
