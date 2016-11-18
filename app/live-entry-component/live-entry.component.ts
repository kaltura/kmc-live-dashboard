import { Component, OnInit, Input } from '@angular/core';
import * as _ from "lodash";
import {Entry} from "../entry.service";
import {TreeTableModule,TreeNode,SharedModule} from 'primeng/primeng';

@Component({
    selector: 'kmc-live-entry',
    templateUrl: './app/live-entry-component/live-entry.component.html',
    styleUrls: ['./app/live-entry-component/live-entry.component.css']
})


export class LiveEntriesComponent implements OnInit {

    @Input() entry : Entry;

    constructor() {

    }

    ngOnInit() {


    }

    ngOnDestroy() {

    }
}