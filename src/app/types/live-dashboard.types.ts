import { KalturaEntryServerNodeType } from "kaltura-ngx-client/api/types/KalturaEntryServerNodeType";

export enum ApplicationMode {
  Default,
  Webcast
}

export interface LiveEntryDynamicStreamInfo {
  redundancy?: boolean,
  streamStatus?: LiveStreamStates,
  streamSession?: LiveStreamSession,
  streamCreationTime?: number
}

export declare type LiveStreamStates = {
  state?: 'Live' | 'Initializing' | 'Offline' | 'Preview',
  serverType?: KalturaEntryServerNodeType;
}

export declare type LiveStreamSession = {
  isInProgress?: boolean,
  shouldTimerRun?: boolean,
  timerStartTime?: number
}

export enum BeaconObjectTypes {
  SCHEDULE_RESOURCE_BEACON = 1,
  ENTRY_SERVER_NODE_BEACON = 2,
  SERVER_NODE_BEACON = 3,
  ENTRY_BEACON = 4
}

export class NodeStreams {
  primary: FlavorObject[];
  secondary: FlavorObject[];
}

export interface Alert {
  Time?: Date,
  Code?: any,
  Arguments?: {}
}

export enum DiagnosticsErrorCodes  {
  EntryRestarted = 100,
  BitrateUnmatched = 101,
  NoAudioSignal = 102,
  NoVideoSignal = 103,
  PtsDrift = 104,
  EntryStopped = 105,
  EntryStarted = 106,
  InvalidKeyFrameInterval = 107,
  HighFpsRate = 108,
  BackupOnlyStreamNoRecording = 109,
  BackupOnlyStreamRecording = 110,
  AuthenticationInvalidToken = 111,
  AuthenticationIncorrectStream = 112,
  AuthenticationEntryNotFound = 113,
  AuthenticationNoLivePermission = 114,
  AuthenticationTooManyStreams = 115,
  AuthenticationTooManyTranscodedStreams = 118
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
  liveEntry: LoadingStatus,
  uiConf: LoadingStatus
}

export enum LoadingStatus {
  initializing,
  failed,
  succeeded
}

export interface LiveEntryDiagnosticsInfo {
  staticInfoPrimary?: { updatedTime?: number, data?: Object },
  staticInfoSecondary?: { updatedTime?: number, data?: Object },
  dynamicInfoPrimary?: { updatedTime?: number, data?: DiagnosticsDynamicInfo },
  dynamicInfoSecondary?: { updatedTime?: number, data?: DiagnosticsDynamicInfo },
  streamHealth?: { updatedTime?: number, data?: DiagnosticsHealthInfo  }
}

export interface DiagnosticsHealthInfo {
  primary?: StreamHealth[],
  secondary?: StreamHealth[]
}

export interface DiagnosticsDynamicInfo {
  inputs?: InputStreamObject[],
  flavors?: FlavorObject[]
}

export interface InputStreamObject {
  index: string,
  bitrate: number,
  ptsData: number[][]
}

export interface FlavorObject {
  name?: string,
  runStatus?: string,
  lastM3U8Time?: string,
  mediaInfo?: FlavorParams,
  wowzaUrl?: string

}

export interface FlavorParams {
  bitrate_kbps?: number,
  resolution?: number[],
  framesPerSecond?: number,
  lastChunkName?: string,
  keyFramesDistance?: number,
  drift?: {
    deltaClock?: number,
    deltaPts?: number,
    refEncoderDts?: number,
    refPts?: number,
    time?: Date
  }
}

export interface PlayerConfig {
  partnerId?: number,
  entryId?: string,
  ks?: string,
  uiConfId?: number,
  serviceUrl?: string
  flashVars?: Object
}
