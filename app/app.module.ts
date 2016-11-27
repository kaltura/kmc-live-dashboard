import  'moment';
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { AppComponent }  from './app.component';
import { LiveEntriesComponent }  from './components/live-entries.component';
import { LiveEntryComponent }  from './components/live-entry.component';
import { LiveEntryCardComponent }  from './components/live-entry-card.component';
import { LiveEntryStatusComponent }  from './components/live-entry-status.component';
import { LiveEntryVideoPreviewComponent }  from './components/live-entry-video-preview.component';

import { TimePipe } from './pipes/time.pipe';
import { RecordStatusPipe } from './pipes/record.status.pipe';
import { ValueWithSpinnerPipe } from './pipes/value-with-spinner.pipe';

import { PanelModule, DialogModule, DropdownModule, MessagesModule,SplitButtonModule,ToggleButtonModule, SelectButtonModule, CheckboxModule, GrowlModule,DataTableModule, SharedModule, InputTextModule, MenuModule, ButtonModule, DataGridModule,InputSwitchModule} from 'primeng/primeng';


import { HttpModule }    from '@angular/http';

//backend
import {KalturaAPIConfig} from './kaltura-api/kaltura-api-config';
import {KalturaAPIClient} from './kaltura-api/kaltura-api-client';


@NgModule({
  imports:
    [
      BrowserModule,
      HttpModule,
      FormsModule,
      ReactiveFormsModule,
      DataGridModule,
      PanelModule,
      DataTableModule,
      SharedModule,
      InputTextModule,
      GrowlModule,
      SelectButtonModule,
      ToggleButtonModule,
      InputSwitchModule,
      SplitButtonModule,
      MessagesModule,
      ButtonModule,
      MenuModule,
      DialogModule,
      DropdownModule,
      CheckboxModule
    ],
  declarations:
    [
      AppComponent,
      LiveEntriesComponent,
      LiveEntryComponent,
      LiveEntryCardComponent,
      LiveEntryStatusComponent,
      LiveEntryVideoPreviewComponent,
      TimePipe,
      ValueWithSpinnerPipe,
      RecordStatusPipe
    ],
  providers:
    [
      KalturaAPIConfig,
      KalturaAPIClient
    ],
  bootstrap: [ LiveEntriesComponent ]
})
export class AppModule { }
