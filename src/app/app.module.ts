import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from "ng2-translate";
import { TooltipModule } from '@kaltura-ng/kaltura-ui';

// PrimeNG
import { TabMenuModule, TabViewModule, InputTextModule, InputTextareaModule, ButtonModule, DropdownModule, CheckboxModule, RadioButtonModule, GrowlModule } from 'primeng/primeng';

// Services
import { KalturaClient } from '@kaltura-ng/kaltura-client/kaltura-client.service';
import { KalturaClientConfiguration } from '@kaltura-ng/kaltura-client/kaltura-client-configuration.service';
import { LiveEntryService } from './services/live-entry.service';
import { ConversionProfileService } from "./services/conversion-profile.service";
import { LiveEntryTimerTaskService } from "./services/entry-timer-task.service";
import { BootstrapService } from "./bootstrap.service";

// Components
import { AppComponent } from './app.component';
import { DetailAndPreviewComponent } from './details-and-preview/details-and-preview.component';
import { StreamInfoComponent } from './stream-info/stream-info.component';
import { EncoderSettingsComponent } from './stream-info/encoder-settings/encoder-settings.component';
import { BasicSettingsComponent } from './stream-info/basic-settings/basic-settings.component';
import { AdditionalSettingsComponent } from './stream-info/additional-settings/additional-settings.component';
import { StreamConfigurationsComponent } from './stream-info/stream-configurations/stream-configurations.component';
import { AreaBlockerComponent } from "@kaltura-ng/kaltura-ui/area-blocker";
import { StreamHealthNotificationsComponent } from './stream-info/stream-health-notifications/stream-health-notifications.component';
import { FurtherInformationComponent } from './stream-info/further-information/further-information.component';
// TODO: Remove!!!
import { KalturaPlayerComponent } from './player/player.component';

// Pipes
import { RecordingTypePipe } from './pipes/recording-type.pipe';
import { ModerationPipe } from './pipes/moderation.pipe';
import { EntryTypePipe } from './pipes/entry-type.pipe';
import { EntryBooleanConfigurationPipe } from './pipes/entry-boolean-configuration.pipe';
import { EntryDynamicInformationPipe } from './pipes/entry-dynamic-information.pipe';
import { TranscodingInfoPipe } from './pipes/transcoding-info.pipe';
import { SafePipe } from "@kaltura-ng/kaltura-ui/safe.pipe";
import { DurationPipe } from "./pipes/duration.pipe";
import { LocaleTimePipe } from "./pipes/locale-time.pipe";
import { SeverityToHealthPipe } from './pipes/severity-to-health.pipe';
import { CodeToSeverityPipe } from './pipes/code-to-severity.pipe';
import { StreamStatusPipe } from './pipes/stream-status.pipe';

// Configuration Services
import { LiveDashboardConfiguration } from "./services/live-dashboard-configuration.service";
import { AppLocalization, AppStorage } from "@kaltura-ng/kaltura-common";

// TODO: Temporary solution! --> remove
export function clientConfigurationFactory() {
  const result = new KalturaClientConfiguration();
  result.endpointUrl = '.';
  result.clientTag = '.';
  return result;
}

@NgModule({
  declarations: [
    AppComponent,
    StreamInfoComponent,
    EncoderSettingsComponent,
    BasicSettingsComponent,
    AdditionalSettingsComponent,
    DetailAndPreviewComponent,
    StreamConfigurationsComponent,
    RecordingTypePipe,
    ModerationPipe,
    EntryTypePipe,
    EntryBooleanConfigurationPipe,
    EntryDynamicInformationPipe,
    TranscodingInfoPipe,
    SafePipe,
    DurationPipe,
    StreamHealthNotificationsComponent,
    LocaleTimePipe,
    AreaBlockerComponent,
    SeverityToHealthPipe,
    CodeToSeverityPipe,
    StreamStatusPipe,
    FurtherInformationComponent,
    KalturaPlayerComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    TranslateModule.forRoot(),
    FormsModule,
    BrowserAnimationsModule,
    TabMenuModule,
    TabViewModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    DropdownModule,
    CheckboxModule,
    RadioButtonModule,
    GrowlModule,
    TooltipModule
  ],
  providers: [
    KalturaClient,
    {
      provide: KalturaClientConfiguration,
      useFactory: clientConfigurationFactory

    },
    LiveEntryService,
    ConversionProfileService,
    LiveEntryTimerTaskService,
    BootstrapService,
    LiveDashboardConfiguration,
    CodeToSeverityPipe,
    StreamStatusPipe,
    AppLocalization,
    AppStorage
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private _bootstrapService: BootstrapService) {
    // TODO: Handle a case where initialization has failed!!!
  }
}
