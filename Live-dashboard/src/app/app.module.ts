import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TabMenuModule, TabViewModule, InputTextModule, InputTextareaModule, ButtonModule, DropdownModule, CheckboxModule, RadioButtonModule } from 'primeng/primeng';

import { KalturaApiService } from './kaltura-api.service';
import { LiveEntryService } from './live-entry.service';

import { AppComponent } from './app.component';
import { SetupAndPreviewComponent } from './setup-and-preview/setup-and-preview.component';
import { EncoderSettingsComponent } from './setup-and-preview/encoder-settings/encoder-settings.component';
import { BasicSettingsComponent } from './setup-and-preview/basic-settings/basic-settings.component';
import { AdditionalSettingsComponent } from './setup-and-preview/additional-settings/additional-settings.component';

@NgModule({
  declarations: [
    AppComponent,
    SetupAndPreviewComponent,
    EncoderSettingsComponent,
    BasicSettingsComponent,
    AdditionalSettingsComponent
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
    KalturaApiService,
    LiveEntryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
