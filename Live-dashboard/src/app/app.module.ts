import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TabMenuModule, TabViewModule, InputTextModule, InputTextareaModule, ButtonModule, DropdownModule, CheckboxModule, RadioButtonModule } from 'primeng/primeng';
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
// Pipes
import { RecordingEnumPipe } from '../pipes/recording-status-enum.pipe';


@NgModule({
  declarations: [
    AppComponent,
    SetupAndPreviewComponent,
    EncoderSettingsComponent,
    BasicSettingsComponent,
    AdditionalSettingsComponent,
    StreamInfoComponent,
    RecordingEnumPipe
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
    RadioButtonModule
  ],
  providers: [
    KalturaClient,
    KalturaClientConfiguration,
    KalturaApiService,
    LiveEntryService,
    ConversionProfileService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {


}
