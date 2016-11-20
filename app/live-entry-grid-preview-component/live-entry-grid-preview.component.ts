import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import * as _ from "lodash";
import {Entry} from "../entry.service";
import {TreeTableModule,TreeNode,SharedModule,ButtonModule} from 'primeng/primeng';

@Component({
    selector: 'kmc-live-entry-grid-preview',
    templateUrl: './app/live-entry-grid-preview-component/live-entry-grid-preview.component.html',
    styleUrls: ['./app/live-entry-grid-preview-component/live-entry-grid-preview.component.css']
})


export class LiveEntryGridPreviewComponent implements OnInit {

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