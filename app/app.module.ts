import  'moment';
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { DropdownModule } from 'ng2-bootstrap/ng2-bootstrap';

import { AppComponent }  from './app.component';
import { EntriesComponent }  from './entries-component/entries.component';

import { EntryTypePipe } from './pipes/entry.type.pipe';
import { LiveStatusPipe } from './pipes/live.status.pipe';
import { RecordStatusPipe } from './pipes/record.status.pipe';
import { EntryStatusPipe } from './pipes/entry.status.pipe';
import { FavoriteEntryPipe } from './pipes/favorite.entry.pipe';
import { TimePipe } from './pipes/time.pipe';

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
      DropdownModule
    ],
  declarations:
    [
      AppComponent,
      EntriesComponent,
      EntryStatusPipe,
      EntryTypePipe,
      TimePipe,
      LiveStatusPipe,
      RecordStatusPipe,
      FavoriteEntryPipe
    ],
  providers:
    [
      KalturaAPIConfig,
      KalturaAPIClient
    ],
  bootstrap: [ EntriesComponent ]
})
export class AppModule { }
