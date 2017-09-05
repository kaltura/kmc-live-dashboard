import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as _ from "lodash";

import {MenuModule,MenuItem,ToggleButtonModule,DialogModule,InputSwitchModule,GrowlModule,Message} from '../../node_modules/primeng/primeng.d';
import {LiveEntry, LiveEntryService} from "./../entry.service";
import {LocalStorage} from 'ng2-webstorage';


@Component({
    selector: 'kmc-live-entries',
    templateUrl: './app/components/live-entries.component.html',
    providers: [
        LiveEntryService
    ],
    styleUrls: ['./app/components/live-entries.component.css'],

})


export class LiveEntriesComponent implements OnInit {
    public msgs: Message[] = [];


    @LocalStorage('gridMode')
    private gridMode:boolean;

    @LocalStorage('pageSize')
    private pageSize:number;

    private selectedEntry: LiveEntry = null;

    private entryMenuItems: MenuItem[];
    private totalEntries:number = 0;
    private displayEntry:boolean = null;


    private firstPage:number = 0;
    private refreshInterval:number = 0;

    entriesList:LiveEntry[] = [];

    private fetching:boolean=true;

    constructor(private entryService:LiveEntryService) {
        if (this.pageSize===null) {
            this.pageSize=8;
        }
        if (this.gridMode===null) {
            this.gridMode=true;
        }
    }

    ngOnInit() {

    }

    get listMode(): boolean {
        return !this.gridMode;
    }
    set listMode(value:boolean) {
        this.gridMode=!value;
    }


    loadData(event) {
        console.debug("loadData ",event);
        this.firstPage=event.first;
        this.pageSize=event.rows;
        this.refresh();
    }

    ngOnDestroy() {
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
            if (this.refreshInterval>0) {
                let timer = Observable.timer(this.refreshInterval * 1000);
                timer.subscribe(t=> {
                    this.refresh();
                });
            }

        });
    }
    showEntry(entry: LiveEntry) {
        this.selectedEntry = entry;
    }

    onActionSelected(action, entryID) {

        alert("Selected Action: " + action + "\nEntry ID: " + entryID);
    }




}

