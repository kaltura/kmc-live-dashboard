import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import * as _ from "lodash";
import {LiveEntry} from "../entry.service";
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import {UIConfService} from "../kaltura-api/ui-conf/uiConf.service";
import { KalturaAPIClient } from '../kaltura-api/kaltura-api-client';
import {SelectItem,DropdownModule} from 'primeng/primeng';



@Component({
    selector: 'kmc-live-entry-video-preview',
    templateUrl: './app/components/live-entry-video-preview.component.html',
    styleUrls: ['./app/components/live-entry-video-preview.component.css']
})


export class LiveEntryVideoPreviewComponent implements OnInit {

    @Input() entry : LiveEntry;

    players: SelectItem[] =[];

    public selectedPlayer:string = "36035511";

    public url:SafeResourceUrl = "";
    public partnerId: number  =1802381;
    constructor(private sanitizer: DomSanitizer,
                private kalturaAPIClient: KalturaAPIClient) {

    }

    get playerIFrameUrl() {
        return this.sanitizer.bypassSecurityTrustResourceUrl("https://cdnapisec.kaltura.com/p/"+this.partnerId+"/sp/"+this.partnerId+"00/embedIframeJs/uiconf_id/"+this.selectedPlayer+"/partner_id/"+this.partnerId+"?iframeembed=true&playerId=kaltura_player_1480260391&entry_id="+this.entry.id+"&flashvars[streamerType]=auto");

    }
    ngOnInit() {
        UIConfService.list().execute(this.kalturaAPIClient).toPromise()
            .then(results => {
                this.players=results.objects.map( (obj) => {
                    return {label:obj.name, value: obj.id};
                });
            });

    }

    ngOnDestroy() {

    }

    openEntry() {
    }
}