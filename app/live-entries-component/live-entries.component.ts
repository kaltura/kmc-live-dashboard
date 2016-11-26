import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from "lodash";

import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { KalturaAPIClient } from './../kaltura-api/kaltura-api-client';
import { LiveStreamService } from './../kaltura-api/live-stream/live-stream.service';
import {isEmpty} from "rxjs/operator/isEmpty";
import {MenuModule,MenuItem,ToggleButtonModule,DialogModule} from 'primeng/primeng';

import 'rxjs/add/operator/merge';
import {LiveEntry, LiveEntryService} from "../entry.service";


@Component({
    selector: 'kmc-live-entries',
    templateUrl: './app/live-entries-component/live-entries.component.html',
    providers: [
        FormBuilder, LiveEntryService
    ],
    styleUrls: ['./app/live-entries-component/live-entries.component.css'],

})


export class LiveEntriesComponent implements OnInit {


    private entries$:Observable<any>;
    private searchForm:FormGroup;
    private sub:any;
    private selectedEntry: LiveEntry = null;
    private gridMode:string = 'List';
    private entryMenuItems: MenuItem[];
    private totalEntries:number = 0;
    private displayEntry:boolean = null;
    private pageSize:number = 4;
    private firstPage:number = 0;

    private valueChanges:any;
    entriesList:LiveEntry[] = [];

    private fetching:boolean=true;

    constructor(private formBuilder:FormBuilder,
                private kalturaAPIClient:KalturaAPIClient,
                private entryService:LiveEntryService) {

        this.searchForm = this.formBuilder.group({
            'search': ['', Validators.required],
            'favoritesOnly': false,
            'liveOnly': false,
        });

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
            this.entryService.favoritesOnly=value;
            this.refresh();
        })
        let valueChanges3=this.searchForm.controls['liveOnly'].valueChanges.subscribe( (value:boolean)=>{
            this.entryService.liveOnly=value;
            this.refresh();
        });

        this.refresh();

    }

    loadData(event) {
        console.debug("loadData ",event);
        this.firstPage=event.first;
        this.pageSize=event.rows;
        this.refresh();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }


    openEntry(entry:LiveEntry) {
        this.selectedEntry = entry;
        this.displayEntry = true;
    }

    toggleEntryFavorite(entry:LiveEntry) {

        entry.isFavorite = !entry.isFavorite;
        this.entryService.saveTag(entry);
    }

    refresh() {

        this.fetching=true;
        this.entryService.list(this.firstPage/this.pageSize+1,this.pageSize).subscribe((entries) => {
            this.totalEntries=this.entryService.totalEntries;
            this.entriesList=this.entryService.entries;
            this.fetching=false;
        });
/*
        this.sub.unsubscribe();
        this.sub = this.entries$.subscribe((entries) => {
            this.entriesList=entries;
        });*/
    }
    showEntry(entry: LiveEntry) {
        this.selectedEntry = entry;
    }

    onActionSelected(action, entryID) {

        alert("Selected Action: " + action + "\nEntry ID: " + entryID);
    }




}

