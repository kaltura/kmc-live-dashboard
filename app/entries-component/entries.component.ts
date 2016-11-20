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
import {MenuModule,MenuItem,ToggleButtonModule,DialogModule} from 'primeng/primeng';

import 'rxjs/add/operator/merge';
import {Entry, EntryService} from "../entry.service";


@Component({
    selector: 'kmc-entries',
    templateUrl: './app/entries-component/entries.component.html',
    providers: [
        FormBuilder, EntryService
    ],
    styleUrls: ['./app/entries-component/entries.component.css'],

})


export class EntriesComponent implements OnInit {

    public static LIVE_DASHBOARD_FAVORITE_TAG = 'live-dashboard-favorite';

    private entries$:Observable<any>;
    private searchForm:FormGroup;
    private filter:any;
    private responseProfile:any;
    private sub:any;
    private selectedEntry: Entry = null;
    private gridMode:string = 'Grid';
    private entryMenuItems: MenuItem[];
    private totalEntries:number = 0;
    private displayEntry:Entry = null;

    private valueChanges:any;
    entriesList:Entry[];
    id2entry :Map<string,Entry>;

    constructor(private formBuilder:FormBuilder,
                private kalturaAPIClient:KalturaAPIClient,
                private entryService:EntryService) {

        this.searchForm = this.formBuilder.group({
            'search': ['', Validators.required],
            'favoritesOnly': false,
            'liveOnly': true,
        });
        this.filter = {
            "objectType": "KalturaLiveStreamEntryFilter",
            "orderBy": "-createdAt"
        };
        this.responseProfile = {
            "objectType": "KalturaDetachedResponseProfile",
            "type": "1",
            "fields": "id,name,thumbnailUrl,liveStatus,recordStatus,dvrStatus,dvrWindow,tags",
            "relatedProfiles:0:objectType": "KalturaDetachedResponseProfile",
            "relatedProfiles:0:type": 1,
            "relatedProfiles:0:fields": "id",
            "relatedProfiles:0:filter:objectType": "KalturaEntryServerNodeFilter",
            "relatedProfiles:0:mappings:0:objectType": "KalturaResponseProfileMapping",
            "relatedProfiles:0:mappings:0:parentProperty": "id",
            "relatedProfiles:0:mappings:0:filterProperty": "entryIdEqual"
        };
    }

    ngOnInit() {

        this.entryMenuItems =   [{
            label: 'File',
            items: [
                {label: 'New', icon: 'fa-plus'},
                {label: 'Open', icon: 'fa-download'}
            ]},
            {
                label: 'Edit',
                items: [
                    {label: 'Undo', icon: 'fa-refresh'},
                    {label: 'Redo', icon: 'fa-repeat'}
                ]
            }];

        this.valueChanges=this.searchForm.controls['search'].valueChanges
            .startWith('')
            .debounceTime(500);
        let valueChanges2=this.searchForm.controls['favoritesOnly'].valueChanges.subscribe( (value:boolean)=>{
            this.onFavoritesFilter();
            this.refresh();
        })
        let valueChanges3=this.searchForm.controls['liveOnly'].valueChanges.subscribe( (value:boolean)=>{
            this.onLiveOnlyFilter();
            this.refresh();
        });

/*
        valueChanges.merge(valueChanges2).subscribe( (value) => {
            console.warn(JSON.stringify(value));
        })*/

/*
        let vv=Observable.merge(valueChanges,valueChanges2).subscribe( (value) => {
            console.warn(value);

        });

*/

        this.onFavoritesFilter();
        this.onLiveOnlyFilter();



    }
    loadData(event) {
        //event.first = First row offset
        //event.rows = Number of rows per page

        this.entries$ = this.valueChanges
            .switchMap(value =>
                LiveStreamService.list(value, this.filter, this.responseProfile,event.rows,event.first)
                    .execute(this.kalturaAPIClient)
                    .map(response => {
                        this.totalEntries=response.totalCount;
                        return response.objects;
                    }));

        this.sub = this.entries$.subscribe((entries) => {
            this.populateData(entries);
        });
    }

    ngOnDestroy() {

        this.sub.unsubscribe();
    }

    onFavoritesFilter() {

        if (this.searchForm.value.favoritesOnly) {
            this.filter["tagsLike"] = EntriesComponent.LIVE_DASHBOARD_FAVORITE_TAG;
        } else {
            delete this.filter["tagsLike"];
        }
    }

    onLiveOnlyFilter() {

        if (this.searchForm.value.liveOnly) {
            this.filter["isLive"] = true;
        } else {
            delete this.filter["isLive"];
        }
    }
    openEntry(entry:Entry) {
        this.displayEntry = entry;
    }

    onFavoriteStateChange(entryId) {

        let entry = _.find(this.entriesList, {'id': entryId});
        if (entry) {
            this.updateEntryTags(entry);
        }
    }

    refresh() {

        this.sub.unsubscribe();
        this.sub = this.entries$.subscribe((entries) => {
            this.populateData(entries);
        });
    }
    showEntry(entry: Entry) {
        this.selectedEntry = entry;
    }

    onActionSelected(action, entryID) {

        alert("Selected Action: " + action + "\nEntry ID: " + entryID);
    }

    private populateData(apiEntries) {
        this.id2entry = new Map<string,Entry>();
        let newEntriesList : Entry[] = apiEntries.map( (apiEntry) => {
            let obj=new Entry(apiEntry);
            this.id2entry.set(obj.id,obj);
            return obj;
        });
        this.entriesList = newEntriesList;
        this.updateEntriesAdditionalData();
    }

    private updateEntriesAdditionalData() {
        //fetching analytics data
        //this.getAnalyticsData();
        //fetching entry server node data
        this.getEntryServerNodeData();


    }

    private getAnalyticsData() {
        let multiRequest = new KalturaMultiRequest();

        _.each(this.entriesList, function (entry, key) {
            if (entry['liveStats']) {
                let filter = {
                    'entryIds': key,
                    'fromTime': -129600,
                    'toTime': -2
                };
                multiRequest.addRequest(LiveAnalyticsService.getEvents('ENTRY_TIME_LINE', filter));
            }
        });

        multiRequest.execute(this.kalturaAPIClient).toPromise()
            .then(results => {
                this.handleAnalyticsData(results)
            })
            .catch(error => {
                console.log(error)
            });
    }

    private handleAnalyticsData(analyticsData) {

        let currentIndex = 0;
        /*
        if (!_.isEmpty(analyticsData)) {
            _.each(this.liveEntriesAdditionalData, (liveEntry) => {
                if (analyticsData[currentIndex] && analyticsData[currentIndex][0] && analyticsData[currentIndex][0]['data']) {
                    let audience = _.split(analyticsData[currentIndex][0]['data'], ';');
                    liveEntry['audience'] = !_.isEmpty(audience) ? this.getLastUpdatedAudienceData(audience) : null;
                }
                currentIndex++;
            });
        }*/
    }

    private getLastUpdatedAudienceData(audienceData) {
        //for some reason the audience array contains redundant empty strings (god knows why - but we need to deal with it)
        for (let i = 1; i <= audienceData.length; i++) {
            let lastValidData = audienceData[audienceData.length - i];
            if (!_.isEmpty(lastValidData)) {
                let lastUpdatedArray = _.split(lastValidData, ',');
                return lastUpdatedArray ? lastUpdatedArray[1] : null; //the idex for the audience parameter the analytics report
            }
        }
        return null;
    }


    private getEntryServerNodeData() {

        let liveEntriesIds = Array.from(this.id2entry.keys());
        if (liveEntriesIds.length==0) {
            return;
        }
        let filter = {
            'entryIdIn': _.join(liveEntriesIds)
        };
        this.id2entry.forEach( (entry, id) => {
            entry.clearEntryServerNodes();
        });


        EntryServerNodeService.list(filter).execute(this.kalturaAPIClient).toPromise()
            .then(results => {
                this.handleEntryServerNodeResult(results)
            })
            .catch(error => {
                console.log(error)
            });
    }

    private handleEntryServerNodeResult(entryServerNodeResult) {
        let self=this;

        _.each(entryServerNodeResult.objects, (entryServerNode) => {
            let liveEntry = self.id2entry.get(entryServerNode.entryId);
            if (!liveEntry) {
                return;
            }
            liveEntry.addEntryServerNode(entryServerNode);
        });


    }

    private updateEntryTags(entry) {

        if (entry.tags.indexOf(EntriesComponent.LIVE_DASHBOARD_FAVORITE_TAG) >= 0) {
            entry.tags = _.replace(entry.tags, EntriesComponent.LIVE_DASHBOARD_FAVORITE_TAG, '');
        } else {
            entry.tags = entry.tags + ',' + EntriesComponent.LIVE_DASHBOARD_FAVORITE_TAG;
        }
        //fix unwanted commas in tags string
        entry.tags = entry.tags.replace(/^[,\s]+|[,\s]+$/g, '').replace(/,[,\s]*,/g, ',');
        let liveStreamEntry = {
            'liveStreamEntry:objectType': 'KalturaLiveStreamEntry',
            'liveStreamEntry:tags': entry.tags
        };

        LiveStreamService.update(entry.id, liveStreamEntry)
            .execute(this.kalturaAPIClient)
            .toPromise()
            .catch((reason) => console.log('ERROR: filed to update entry tags. ' + reason));
    }

}

