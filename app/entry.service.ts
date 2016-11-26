import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KalturaAPIClient } from './kaltura-api/kaltura-api-client';
import { EntryServerNodeService } from './kaltura-api/entry-server-node/entry-server-node.service';
import { LiveStreamService } from './kaltura-api/live-stream/live-stream.service';
import { LiveAnalyticsService } from './kaltura-api/live-analytics/live-analytics.service';
import { KalturaMultiRequest } from './kaltura-api/kaltura-multi-request';
import * as _ from "lodash";


export class Stream {
    isPrimary: boolean;
    flavorId: string;
    bitrate: number;
    width: number;
    height: number;
    fps: number;
    isTranscoded: boolean;
    keyFrameInterval: number;
    samplingRate: number;
}

export class InputEncoderSettings {
    video_codec: string;
    video_bitrate: number;
    video_fps: number;
    audio_codec: string;
    audio_samplingRate: number;
}
export class Input {
    server: string;
    index: number;
    uptime: string;
    bitrate: number;
    address: string;
    encoderSettings: InputEncoderSettings;
}

export class EntryServerNode {
    inputStreams: Input[];
    outputStreams: Stream[];

}

export class LiveEntry {
    constructor(apiEntry) {
        this.id = apiEntry.id;
        this.name = apiEntry.name;
        this.tags=apiEntry.tags;
        this.createdAt = apiEntry.createdAt;
        this.liveStatus = apiEntry.liveStatus;
        this.thumbnailUrl = apiEntry.thumbnailUrl;
        this.duration = apiEntry.duration;
        this.plays = apiEntry.plays;
        this.startTime = new Date();
        this.entryServerNodes = []
        this.mediaType = apiEntry.mediaType;
        this.dvrStatus = apiEntry.dvrStatus;
        this.dvrWindow = apiEntry.dvrWindow;
        this.recordStatus = apiEntry.recordStatus;
    }
    entryServerNodes: EntryServerNode[];
    id: string;
    tags:string;
    name: string;
    thumbnailUrl: string;
    mediaType: string;
    plays: string;
    createdAt: string;
    duration: string;
    liveStatus: number;
    dvrWindow: number;
    recordStatus: number;
    dvrStatus: boolean;
    redundant:boolean =false;
    startTime:Date = null;
    flavors: number = null;
    audience: number = null;

    public clearEntryServerNodes() {
        this.entryServerNodes=[];
    }

    public addEntryServerNode(entryServerNode) {
        this.entryServerNodes.push(entryServerNode);

        entryServerNode.inputStreams = [
            {server:"abc",
                index: 1,
                uptime: "00:10:00",
                bitrate: 500,
                address: "128.5.4.3:3000",
                encoderSettings: {
                    video_codec: "H264",
                    video_bitrate: 100000,
                    video_fps: 30,
                    audio_codec: "AAC",
                    audio_samplingRate: "44100"
                }
            }];
        entryServerNode.outputStreams=[];
        entryServerNode.isPrimary = (entryServerNode.serverType==0);

        entryServerNode.streams.forEach( (stream) => {
            let outputstream = new Stream();
            outputstream.bitrate = stream.bitrate;
            outputstream.height = stream.height;
            outputstream.width = stream.width;
            outputstream.flavorId = stream.flavorId;
            outputstream.isTranscoded = true;
            entryServerNode.outputStreams.push(outputstream);
        });

        this.flavors = entryServerNode.streams.length;
        this.redundant = (this.entryServerNodes.length > 1);
        if (!this.startTime  || this.startTime.getTime()>entryServerNode.createdAt*1000)
        {
            this.startTime = new Date(entryServerNode.createdAt*1000);
        }
//        console.warn(`Updated entry ${this.id}`)

    }

    get isFavorite(): boolean {
        return this.tags.indexOf(LiveEntryService.LIVE_DASHBOARD_FAVORITE_TAG) >= 0;
    }

    set isFavorite(value: boolean) {
        if (value ) {
            if (!this.isFavorite) {
                this.tags = this.tags + ',' + LiveEntryService.LIVE_DASHBOARD_FAVORITE_TAG;
            }
        } else {
            this.tags = _.replace(this.tags, LiveEntryService.LIVE_DASHBOARD_FAVORITE_TAG, '');
        }

        //fix unwanted commas in tags string
        this.tags = this.tags.replace(/^[,\s]+|[,\s]+$/g, '').replace(/,[,\s]*,/g, ',');
    }

    updateFromAnalyticData(analyticsData:any) {
        let audienceData = _.split(analyticsData['data'], ';');

        //for some reason the audience array contains redundant empty strings (god knows why - but we need to deal with it)
        for (let i = audienceData.length-1; i >=0; i--) {
            let lastValidData = audienceData[i];
            if (!_.isEmpty(lastValidData)) {
                let lastUpdatedArray = _.split(lastValidData, ',');
                if ( lastUpdatedArray && lastUpdatedArray.length>=1 ) {
                    this.audience =  parseFloat(lastUpdatedArray[1]);
                    return;
                }
            }
        }
        this.audience=0;
    }



}


@Injectable()
export class LiveEntryService {

    public static LIVE_DASHBOARD_FAVORITE_TAG = 'live-dashboard-favorite';


    private entries$:Observable<any>;

    private filter:any;
    private responseProfile:any;
    public pageSize:number;
    public totalEntries:number;
    public liveOnly: boolean = false;
    public favoritesOnly: boolean = false;
    public entries: LiveEntry[];

    private id2entry : Map<string,LiveEntry>;

    constructor(private kalturaAPIClient:KalturaAPIClient) {
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

    list(pageIndex,pageSize):Observable<any> {

        if (this.favoritesOnly) {
            this.filter["tagsLike"] = LiveEntryService.LIVE_DASHBOARD_FAVORITE_TAG;
        } else {
            delete this.filter["tagsLike"];
        }
        if (this.liveOnly) {
            this.filter["isLive"] = true;
        } else {
            delete this.filter["isLive"];
        }

        this.entries$ = LiveStreamService.list("", this.filter, this.responseProfile,pageSize,pageIndex)
                    .execute(this.kalturaAPIClient)
                    .map(response => {
                        this.totalEntries=response.totalCount;
                        this.id2entry = new Map<string,LiveEntry>();
                        this.entries = response.objects.map( (apiEntry) => {
                            let obj=new LiveEntry(apiEntry);
                            this.id2entry.set(obj.id,obj);
                            return obj;
                        });
                        return this.updateEntriesAdditionalData();
                    });

        return this.entries$;
    }


    private updateEntriesAdditionalData() {
        //fetching analytics data
        this.getAnalyticsData();
        //fetching entry server node data
        return this.getEntryServerNodeData();


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


        return EntryServerNodeService.list(filter).execute(this.kalturaAPIClient).toPromise()
            .then(results => {
                this.handleEntryServerNodeResult(results)
            })
            .catch(error => {
                console.log(error)
            });
    }

    private handleEntryServerNodeResult(entryServerNodeResult) {

        _.each(entryServerNodeResult.objects, (entryServerNode) => {
            let liveEntry = this.id2entry.get(entryServerNode.entryId);
            if (!liveEntry) {
                return;
            }
            liveEntry.addEntryServerNode(entryServerNode);
        });


    }

    saveTag(entry:LiveEntry) {

        let liveStreamEntry = {
            'liveStreamEntry:objectType': 'KalturaLiveStreamEntry',
            'liveStreamEntry:tags': entry.tags
        };

        LiveStreamService.update(entry.id, liveStreamEntry)
            .execute(this.kalturaAPIClient)
            .toPromise()
            .catch((reason) => console.log('ERROR: filed to update entry tags. ' + reason));
    }






    private getAnalyticsData() {
        let multiRequest = new KalturaMultiRequest();

        let entries :LiveEntry[]=[];

        this.id2entry.forEach( (entry, entryId) => {

            if (entry.liveStatus>0) {
                let filter = {
                    'entryIds': entryId,
                    'fromTime': -129600,
                    'toTime': -2
                };
                entries.push(entry);
                multiRequest.addRequest(LiveAnalyticsService.getEvents('ENTRY_TIME_LINE', filter));
            } else {
                entry.audience=0;
            }
        });

        if (entries.length>0) {
            multiRequest.execute(this.kalturaAPIClient).toPromise()
                .then(results => {
                    this.handleAnalyticsData(entries, results)
                })
                .catch(error => {
                    console.log(error)
                });
        }
    }

    private handleAnalyticsData(liveEntries :LiveEntry[],analyticsDatas) {
        _.each(analyticsDatas, (analyticsData, index) => {

             let liveEntry = liveEntries[index];
             if (!liveEntry) {
                 return;
             }
             liveEntry.updateFromAnalyticData(analyticsData[0]);
         });
    }

}
