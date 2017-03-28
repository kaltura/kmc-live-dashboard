import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import * as _ from "lodash";
import {LiveEntry} from "../entry.service";
import {TreeTableModule,TreeNode,SharedModule,ButtonModule} from '../../node_modules/primeng/primeng.d';

@Component({
    selector: 'kmc-live-entry-card',
    templateUrl: './app/components/live-entry-card.component.html',
    styleUrls: ['./app/components/live-entry-card.component.css']
})


export class LiveEntryCardComponent implements OnInit {

    @Input() entry : LiveEntry;
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