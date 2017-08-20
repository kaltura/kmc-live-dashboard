import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from "ng2-translate";
import { TooltipModule } from '@kaltura-ng/kaltura-ui';
// PrimeNG
import { TabMenuModule, TabViewModule, InputTextModule, InputTextareaModule, ButtonModule, DropdownModule, CheckboxModule, RadioButtonModule, GrowlModule } from 'primeng/primeng';
// Services
import { KalturaClient } from '@kaltura-ng/kaltura-client/kaltura-client.service';
import { KalturaClientConfiguration } from '@kaltura-ng/kaltura-client/kaltura-client-configuration.service';
import { LiveEntryService } from './live-entry.service';
import { ConversionProfileService } from "./conversion-profile.service";
import { LiveEntryTimerTaskService } from "./entry-timer-task.service";
import { BootstrapService } from "./bootstrap.service";
// Components
import { AppComponent } from './app.component';
import { StreamInfoComponent } from './stream-info/stream-info.component';
import { SetupAndPreviewComponent } from './setup-and-preview/setup-and-preview.component';
import { EncoderSettingsComponent } from './setup-and-preview/encoder-settings/encoder-settings.component';
import { BasicSettingsComponent } from './setup-and-preview/basic-settings/basic-settings.component';
import { AdditionalSettingsComponent } from './setup-and-preview/additional-settings/additional-settings.component';
import { StreamConfigurationsComponent } from './setup-and-preview/stream-configurations/stream-configurations.component';
// Pipes
import { RecordingTypePipe } from '../pipes/recording-type.pipe';
import { ModerationPipe } from '../pipes/moderation.pipe';
import { EntryTypePipe } from '../pipes/entry-type.pipe';
import { EntryBooleanConfigurationPipe } from '../pipes/entry-boolean-configuration.pipe';
import { EntryDynamicInformationPipe } from '../pipes/entry-dynamic-information.pipe';
import { TranscodingInfoPipe } from '../pipes/transcoding-info.pipe';
import { SafePipe } from "@kaltura-ng/kaltura-ui/safe.pipe";
import { DurationPipe } from "../pipes/duration.pipe";

// Configuration Services
import { LiveDashboardConfiguration } from "./services/live-dashboard-configuration.service";
import { StreamHealthNotificationsComponent } from './setup-and-preview/stream-health-notifications/stream-health-notifications.component';
// TODO: Remove!
import { KalturaApiService } from "./kaltura-api.service";
import {LocaleTimePipe} from "../pipes/locale-time.pipe";


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
    LocaleTimePipe
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
    KalturaClientConfiguration,
    LiveEntryService,
    ConversionProfileService,
    LiveEntryTimerTaskService,
    BootstrapService,
    LiveDashboardConfiguration,
    KalturaApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private _bootstrapService: BootstrapService) {
    // TODO: Handle a case where initialization has failed!!!
  }
}
