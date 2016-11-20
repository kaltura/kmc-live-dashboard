import { Injectable } from '@angular/core';


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

export class Input {
    server: string;
    index: number;
    uptime: string;
    bitrate: number;
    address: string;
}

export class EntryServerNode {
    inputStreams: Input[];
    outputStreams: Stream[];

}

export class Entry {
    constructor(apiEntry) {
        this.id = apiEntry.id;
        this.name = apiEntry.name;
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
    name: string;
    thumbnailUrl: string;
    mediaType: string;
    plays: string;
    createdAt: string;
    duration: string;
    liveStatus: number;
    dvrWindow: number;
    recordStatus: number;
    dvrStatus: number;
    redundant:boolean =false;
    startTime:Date = null;
    flavors: number = null;

    public clearEntryServerNodes() {
        this.entryServerNodes=[];
    }

    public addEntryServerNode(entryServerNode) {
        this.entryServerNodes.push(entryServerNode);

        entryServerNode.inputStreams = [{server:"abc", index: 1, uptime: "00:10:00", bitrate: 500, address: "128.5.4.3:3000"}];
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
}


@Injectable()
export class EntryService {

}