import {KalturaLiveStreamParams} from "kaltura-typescript-client/types/KalturaLiveStreamParams";

export interface LiveEntryDynamicStreamInfo {
  redundancy?: boolean,
  streamStatus?: LiveStreamStates,
  streamSession?: LiveStreamSession,
  allStreams?: NodeStreams
  streamCreationTime?: number
}

export declare type LiveStreamStates = 'Live' | 'Initializing' | 'Offline';

export declare type LiveStreamSession = {
  isInProgress?: boolean,
  shouldTimerRun?: boolean,
  timerStartTime?: number
}

export class NodeStreams {
  primary: KalturaLiveStreamParams[];
  secondary: KalturaLiveStreamParams[];
}

export interface Alert {
  Time?: Date,
  Code?: any,
  Arguments?: {}
}

export enum DiagnosticsErrorCodes  {
  MissingTrackAlert = 4,
  InvalidKeyFramesAlert = 6,
  EntryRestartedAlert = 100,
  BitrateUnmatched = 101,
  NoAudioSignal = 102,
  NoVideoSignal = 103,
  PtsDrift = 104,
  EntryStopped = 105,
  EntryStarted = 106
}

export enum AlertSeverity {
  debug = 0,
  info = 1,
  warning = 2,
  error = 3,
  critical = 4
}

export enum StreamHealthStatus  {
  Good = <any> 'Good',
  Fair = <any> 'Fair',
  Poor = <any> 'Poor'
}

export interface StreamHealth {
  id?: number,
  updatedTime?: number,
  severity?: number,
  isPrimary?: boolean,
  alerts?: Alert[]
}

export interface LiveEntryStaticConfiguration {
  dvr?: boolean,
  recording?: boolean,
  transcoding?: boolean,
}

export interface ApplicationStatus {
  streamStatus: LoadingStatus,
  streamHealth: LoadingStatus,
  liveEntry: LoadingStatus
}

export enum LoadingStatus {
  initializing,
  failed,
  succeeded
}

export interface LiveEntryDiagnosticsInfo {
  staticInfo?: { updatedTime?: number, data?: Object },
  dynamicInfo?: { updatedTime?: number, data?: Object },
  streamHealth?: { updatedTime?: number, data?: StreamHealth[] }
}
