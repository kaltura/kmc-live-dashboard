import  'moment';
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { DropdownModule } from 'ng2-bootstrap/ng2-bootstrap';
import { ButtonsModule } from 'ng2-bootstrap/components/buttons';

import { AppComponent }  from './app.component';
import { LiveEntriesComponent }  from './live-entries-component/live-entries.component';
import { LiveEntryComponent }  from './live-entry-component/live-entry.component';
import { LiveEntryCardComponent }  from './live-entry-card-component/live-entry-card.component';

import { LiveStatusPipe } from './pipes/live.status.pipe';
import { TimePipe } from './pipes/time.pipe';
import { RecordStatusPipe } from './pipes/record.status.pipe';
import { ValueWithSpinnerPipe } from './pipes/value-with-spinner.pipe';

import { PanelModule, DialogModule, ToggleButtonModule, SelectButtonModule, CheckboxModule, DataTableModule, SharedModule, InputTextModule, MenuModule, ButtonModule, DataGridModule} from 'primeng/primeng';


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
      SelectButtonModule,
      ToggleButtonModule,
      ButtonModule,
      MenuModule,
      DialogModule,
      DropdownModule,
      CheckboxModule,
      ButtonsModule
    ],
  declarations:
    [
      AppComponent,
      LiveEntriesComponent,
      LiveEntryComponent,
      LiveEntryCardComponent,
      TimePipe,
      LiveStatusPipe,
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
