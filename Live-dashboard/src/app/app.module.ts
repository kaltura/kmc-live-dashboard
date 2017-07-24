import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpModule, Http} from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// PrimeNG
import { TabMenuModule, TabViewModule, InputTextModule, InputTextareaModule, ButtonModule, DropdownModule, CheckboxModule, RadioButtonModule, GrowlModule } from 'primeng/primeng';
// Services
import { KalturaClient } from '@kaltura-ng/kaltura-client/kaltura-client.service';
import { KalturaClientConfiguration } from '@kaltura-ng/kaltura-client/kaltura-client-configuration.service';
import { KalturaApiService } from './kaltura-api.service';
import { LiveEntryService } from './live-entry.service';
import { ConversionProfileService } from "./conversion-profile.service";
import { LiveEntryTimerTaskService } from "./entry-timer-task.service";
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
// Configuration
import { environment } from '../environments/environment';
import {TranslateModule} from "ng2-translate";


(<any>window).kmc = (<any>window).kmc || {};
(<any>window).kmc.vars = (<any>window).kmc.vars || {};

(<any>window).kmc = {
  vars : {
    ks : 'ODBiYmFhZTllMGQzZDgxNmU3NDFiNWM3OWZlZjUyNTUxNTQ1NTIxYXwxMDI7MTAyOzE1MDE2NjI0OTM7MjsxNDk5MDcwNDkzLjYzNTs7Ozs=',
    endpoint : environment.kaltura.apiUrl
  }
};

export function clientConfigurationFactory() : KalturaClientConfiguration  {
  const result = new KalturaClientConfiguration();

  if ((<any>window).kmc && (<any>window).kmc.vars) {
    result.endpointUrl = (<any>window).kmc.vars.endpoint;
  }
  else {
    throw new Error('Missing kalturaServerEndpoint');
  }
  result.clientTag = 'KalturaLiveDashboard';

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
    EntryTypePipe
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
    GrowlModule
  ],
  providers: [
    KalturaClient,
    {
      provide: KalturaClientConfiguration,
      useFactory: clientConfigurationFactory
    },
    KalturaApiService,
    LiveEntryService,
    ConversionProfileService,
    LiveEntryTimerTaskService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private _kalturaClient: KalturaClient) {
    if ((<any>window).kmc && (<any>window).kmc.vars) {
      _kalturaClient.ks = (<any>window).kmc.vars.ks;
    }
    else {
      throw new Error('Missing kalturaServerKs');
    }
  }
}
