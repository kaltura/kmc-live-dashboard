import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from "lodash";

import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { KalturaAPIClient } from './../kaltura-api/kaltura-api-client';
import { KalturaMultiRequest } from './../kaltura-api/kaltura-multi-request';
import { LiveStreamService } from './../kaltura-api/live-stream/live-stream.service';
import { LiveAnalyticsService } from './../kaltura-api/live-analytics/live-analytics.service';
import { EntryServerNodeService } from './../kaltura-api/entry-server-node/entry-server-node.service';
import {isEmpty} from "rxjs/operator/isEmpty";

export interface Entry {
  id: string;
  name: string;
  thumbnailUrl: string;
  mediaType: string;
  plays: string;
  createdAt: string;
  duration: string;
  status: string;
}

@Component({
  selector: 'kmc-entries',
  templateUrl: './app/entries-component/entries.component.html',
  providers: [
    FormBuilder
  ],
  styleUrls:  ['./app/entries-component/entries.component.css'],

})
export class EntriesComponent implements OnInit {

  public static LIVE_DASHBOARD_FAVORITE_TAG = 'live-dashboard-favorite';

  private entries$: Observable<any>;
  private searchForm: FormGroup;
  private filter: any;
  private responseProfile: any;
  private sub: any;

  favoritesOnly : boolean = false;
  entriesList: Entry[];
  liveEntriesAdditionalData = {};

  constructor(private formBuilder: FormBuilder, private kalturaAPIClient : KalturaAPIClient) {

    this.searchForm = this.formBuilder.group({
      'search': ['', Validators.required]
    });
    this.filter = {
      "objectType": "KalturaLiveStreamEntryFilter",
      "orderBy": "-createdAt"
    };
    this.responseProfile = {
      "objectType": "KalturaDetachedResponseProfile",
      "type": "1",
      "fields": "id,name,thumbnailUrl,liveStatus,recordStatus,dvrStatus,dvrWindow,tags"
    };
  }

  ngOnInit() {

    this.entries$ = this.searchForm.controls['search'].valueChanges
      .startWith('')
      .debounceTime(500)
      .switchMap(value =>
        LiveStreamService.list(value, this.filter, this.responseProfile)
          .execute(this.kalturaAPIClient)
          .map(response => response.objects));

    this.sub = this.entries$.subscribe((entries) => {
      this.populateData(entries);
    });
  }

  ngOnDestroy() {

    this.sub.unsubscribe();
  }

  onFavoritesFilter() {

    this.favoritesOnly = !this.favoritesOnly;
    if(this.favoritesOnly) {
      this.filter["tagsLike"] = EntriesComponent.LIVE_DASHBOARD_FAVORITE_TAG;
    } else {
      delete this.filter["tagsLike"];
    }
    this.refresh();
  }

  onFavoriteStateChange(entryId) {

    let entry = _.find(this.entriesList, {'id' : entryId});
    if(entry) {
      this.updateEntryTags(entry);
    }
  }

  refresh() {

    this.sub.unsubscribe();
    this.sub = this.entries$.subscribe((entries) => {
      this.populateData(entries);
    });
  }

  onActionSelected(action, entryID) {

    alert("Selected Action: "+action+"\nEntry ID: "+entryID);
  }

  private populateData(entries) {

    this.entriesList = entries;
    this.updateEntriesAdditionalData();
  }

  private updateEntriesAdditionalData(){

    this.liveEntriesAdditionalData = {};

    _.each(this.entriesList, (entry) => {
      if(entry['liveStatus']) {
        this.liveEntriesAdditionalData[entry.id] = {id : entry.id};
      }
    });
    if(!_.isEmpty(this.liveEntriesAdditionalData)) {
      //fetching analytics data
      this.getAnalyticsData();
      //fetching entry server node data
      this.getEntryServerNodeData();
    }

  }

  private getAnalyticsData() {

    let multiRequest = new KalturaMultiRequest();

    _.each(this.liveEntriesAdditionalData, function(value, key) {
      let filter = {
        'entryIds' : key,
        'fromTime' : -129600,
        'toTime' : -2
      };
      multiRequest.addRequest(LiveAnalyticsService.getEvents('ENTRY_TIME_LINE', filter));
    });

    multiRequest.execute(this.kalturaAPIClient).toPromise()
      .then(results => {this.handleAnalyticsData(results)})
      .catch(error => {console.log(error)});
  }

  private handleAnalyticsData(analyticsData) {

    let currentIndex = 0;
    if(!_.isEmpty(analyticsData)) {
      _.each(this.liveEntriesAdditionalData, (liveEntry) => {
        if(analyticsData[currentIndex] && analyticsData[currentIndex][0] && analyticsData[currentIndex][0]['data']) {
          let audience = _.split(analyticsData[currentIndex][0]['data'], ';');
          liveEntry['audience'] = !_.isEmpty(audience) ? this.getLastUpdatedAudienceData(audience) : null;
        }
        currentIndex++;
      });
    }
  }

  private getLastUpdatedAudienceData(audienceData) {
    //for some reason the audience array contains redundant empty strings (god knows why - but we need to deal with it)
    for(let i = 1 ; i <= audienceData.length ; i++) {
      let lastValidData = audienceData[audienceData.length - i];
      if(!_.isEmpty(lastValidData)){
        let lastUpdatedArray = _.split(lastValidData, ',');
        return lastUpdatedArray ? lastUpdatedArray[1] : null; //the idex for the audience parameter the analytics report
      }
    }
    return null;
  }



  private getEntryServerNodeData() {

    let liveEntriesIds = _.keys(this.liveEntriesAdditionalData);
    let filter = {
      'entryIdIn' : _.join(liveEntriesIds)
    };
     EntryServerNodeService.list(filter).execute(this.kalturaAPIClient).toPromise()
       .then(results => {this.handleEntryServerNodeDate(results)})
       .catch(error => {console.log(error)});
  }

  private handleEntryServerNodeDate(nodeData) {

    console.log(nodeData);
  }

  private updateEntryTags(entry) {

    if(entry.tags.indexOf(EntriesComponent.LIVE_DASHBOARD_FAVORITE_TAG) >= 0) {
      entry.tags = _.replace(entry.tags, EntriesComponent.LIVE_DASHBOARD_FAVORITE_TAG, '');
    }else {
      entry.tags = entry.tags + ',' + EntriesComponent.LIVE_DASHBOARD_FAVORITE_TAG;
    }
    //fix unwanted commas in tags string
    entry.tags = entry.tags.replace(/^[,\s]+|[,\s]+$/g, '').replace(/,[,\s]*,/g, ',');
    let liveStreamEntry = {
      'liveStreamEntry:objectType' : 'KalturaLiveStreamEntry',
      'liveStreamEntry:tags': entry.tags
    };

    LiveStreamService.update(entry.id, liveStreamEntry)
      .execute(this.kalturaAPIClient)
      .toPromise()
      .catch((reason) => console.log('ERROR: filed to update entry tags. ' + reason));
  }

}

