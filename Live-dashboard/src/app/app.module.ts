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
import { StreamInfoComponent } from './stream-info/stream-info.component';
import { SetupAndPreviewComponent } from './setup-and-preview/setup-and-preview.component';
import { EncoderSettingsComponent } from './setup-and-preview/encoder-settings/encoder-settings.component';
import { BasicSettingsComponent } from './setup-and-preview/basic-settings/basic-settings.component';
import { AdditionalSettingsComponent } from './setup-and-preview/additional-settings/additional-settings.component';
import { StreamConfigurationsComponent } from './setup-and-preview/stream-configurations/stream-configurations.component';
import { AreaBlockerComponent } from "@kaltura-ng/kaltura-ui/area-blocker";
import { StreamHealthNotificationsComponent } from './setup-and-preview/stream-health-notifications/stream-health-notifications.component';

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

// Configuration Services
import { LiveDashboardConfiguration } from "./services/live-dashboard-configuration.service";
// TODO: Remove!!!!!!!!
import { KalturaApiService } from "./services/kaltura-api.service";
import { CodeToSeverityPipe } from './pipes/code-to-severity.pipe';

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
    SetupAndPreviewComponent,
    EncoderSettingsComponent,
    BasicSettingsComponent,
    AdditionalSettingsComponent,
    StreamInfoComponent,
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
    CodeToSeverityPipe
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
    KalturaApiService,
    CodeToSeverityPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private _bootstrapService: BootstrapService) {
    // TODO: Handle a case where initialization has failed!!!
  }
}
