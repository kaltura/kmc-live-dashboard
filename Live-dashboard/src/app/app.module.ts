import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TabMenuModule, TabViewModule, InputTextModule, InputTextareaModule, ButtonModule, DropdownModule, CheckboxModule, RadioButtonModule, GrowlModule } from 'primeng/primeng';
// Services
import { KalturaClient } from '@kaltura-ng/kaltura-client/kaltura-client.service';
import { KalturaClientConfiguration } from '@kaltura-ng/kaltura-client/kaltura-client-configuration.service';
import { KalturaApiService } from './kaltura-api.service';
import { LiveEntryService } from './live-entry.service';
import { ConversionProfileService } from "./conversion-profile.service";
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



(<any>window).kmc = (<any>window).kmc || {};
(<any>window).kmc.vars = (<any>window).kmc.vars || {};

(<any>window).kmc = {
  vars : {
    ks : 'YWQwODZiOTA5NDU4MmI4YzBiNjQ3NmU4OTc1N2U2YmYyYjZkYTE0NXwxMDI7MTAyOzE0OTg1NTQzNDM7MjsxNDk1OTYyMzQzLjQ4MDY7Ozs7',
    endpoint : 'http://10.0.80.11/api_v3/index.php'
  }
};

/*function getKalturaClientConfigurations(): KalturaClientConfiguration {
  const result = new KalturaClientConfiguration();

  if ((<any>window).kmc && (<any>window).kmc.vars) {
    const { ks, endpoint } = (<any>window).kmc.vars;
    result.ks = ks;
    result.endpointUrl = endpoint;
  }
  result.clientTag = 'KalturaLiveDashboard';

  return result;
}*/

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
    FormsModule,
    HttpModule,
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
      useFactory: () => {
        const result = new KalturaClientConfiguration();

        if ((<any>window).kmc && (<any>window).kmc.vars) {
          const { ks, endpoint } = (<any>window).kmc.vars;
          result.ks = ks;
          result.endpointUrl = endpoint;
        }
        result.clientTag = 'KalturaLiveDashboard';

        return result;
      }
    },
    KalturaApiService,
    LiveEntryService,
    ConversionProfileService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {


}
