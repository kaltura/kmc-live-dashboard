import  'moment';
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { DropdownModule } from 'ng2-bootstrap/ng2-bootstrap';
import { CheckboxModule } from 'primeng/primeng';

import { AppComponent }  from './app.component';
import { EntriesComponent }  from './entries-component/entries.component';
import { LiveEntriesComponent }  from './live-entry-component/live-entry.component';

import { LiveStatusPipe } from './pipes/live.status.pipe';
import { TimePipe } from './pipes/time.pipe';
import { RecordStatusPipe } from './pipes/record.status.pipe';

import { DataTableModule, SharedModule, InputTextModule, ButtonModule} from 'primeng/primeng';


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
      DataTableModule,
      SharedModule,
      InputTextModule,
      ButtonModule,
      DropdownModule,
      CheckboxModule
    ],
  declarations:
    [
      AppComponent,
      EntriesComponent,
      LiveEntriesComponent,
      TimePipe,
      LiveStatusPipe,
      RecordStatusPipe
    ],
  providers:
    [
      KalturaAPIConfig,
      KalturaAPIClient
    ],
  bootstrap: [ EntriesComponent ]
})
export class AppModule { }
