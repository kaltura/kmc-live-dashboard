import { Component, OnInit, Input } from '@angular/core';
import * as _ from "lodash";
import {LiveEntry} from "../entry.service";
import {TreeTableModule,TreeNode,SharedModule,MessagesModule} from '../../node_modules/primeng/primeng.d';

@Component({
    selector: 'kmc-live-entry',
    templateUrl: './app/components/live-entry.component.html',
    styleUrls: ['./app/components/live-entry.component.css']
})


export class LiveEntryComponent implements OnInit {

    @Input() entry : LiveEntry;

    constructor() {
    }

    ngOnInit() {


    }

    ngOnDestroy() {

    }
}