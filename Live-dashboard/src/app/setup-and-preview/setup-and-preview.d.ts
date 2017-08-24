export interface Alert {
  Time?: Date,
  Code?: any,
  Arguments?: {},
  Health?: string,
  Severity?: string,
  name?: string,
  key?: number,
  isTimed?: boolean
}

export enum DiagnosticsErrorCodes  {
  TsConversionFailureAlert = 0,
  NoID3TagAlert = 1,
  PtsMisalignmentAlert = 2,
  InvalidM3u8Alert = 3,
  MissingTrackAlert = 4,
  OverlapPtsAlert = 5,
  InvalidKeyFramesAlert = 6,
  InvalidTypeAlert = 7,
  MissingReferenceAlert = 8,
  ValueOutOfRangeAlert = 9,
  TargetDurationExceededAlert = 10,
  PtsDiscontinuityAlert = 11,
  EntryRestartedAlert = 100,
  BitrateUnmatched = 101,
  NoAudioSignal = 102,
  NoVideoSignal = 103,
  PtsDrift = 104,
  EntryStopped = 105,
  EntryStarted = 106
}
