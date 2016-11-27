import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import * as _ from "lodash";
import {LiveEntry} from "../entry.service";

@Component({
    selector: 'live-entry-status',
    template: '<span class="ldb-entry-status ldb-entry-status-live" [class]="className">{{status}}</span>',
    styleUrls: ['./app/components/live-entry-status.component.css']
})


export class LiveEntryStatusComponent implements OnInit {

    static statusMap:any={
        0: ["OFFLINE","ldb-entry-status-offline"],
        1: ["LIVE","ldb-entry-status-live"],
        2: ["PENDING","ldb-entry-status-pending"],
        3: ["PENDING","ldb-entry-status-pending"],
        100: ["ERROR","ldb-entry-status-offline"]
    };
    @Input() entry : LiveEntry;

    get status() {
        let status=LiveEntryStatusComponent.statusMap[this.entry.liveStatus];
        if (!status) {
            status=LiveEntryStatusComponent.statusMap[100];
        }
        return status[0];
    }

    get className() {
        let status=LiveEntryStatusComponent.statusMap[this.entry.liveStatus];
        if (!status) {
            status=LiveEntryStatusComponent.statusMap[100];
        }
        return status[1];
    }


    constructor() {

    }

    ngOnInit() {


    }

    ngOnDestroy() {

    }
}