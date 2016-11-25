import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import * as _ from "lodash";
import {Entry} from "../entry.service";
import {TreeTableModule,TreeNode,SharedModule,ButtonModule} from 'primeng/primeng';

@Component({
    selector: 'kmc-live-entry-card',
    templateUrl: './app/live-entry-card-component/live-entry-card.component.html',
    styleUrls: ['./app/live-entry-card-component/live-entry-card.component.css']
})


export class LiveEntryCardComponent implements OnInit {

    @Input() entry : Entry;
    @Output() onOpen: EventEmitter<any> = new EventEmitter();


    constructor() {

    }

    ngOnInit() {


    }

    ngOnDestroy() {

    }

    openEntry() {
        this.onOpen.emit();
    }
}