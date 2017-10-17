import { Pipe, PipeTransform } from '@angular/core';
import { DiagnosticsErrorCodes, AlertSeverity } from "../types/live-dashboard.types";


@Pipe({
  name: 'codeToSeverity'
})
export class CodeToSeverityPipe implements PipeTransform {

  transform(code : number, recordingEnabled?: boolean): number {

    switch (code) {
      case DiagnosticsErrorCodes.BitrateUnmatched:
      case DiagnosticsErrorCodes.EntryStopped:
      case DiagnosticsErrorCodes.EntryStarted:
      case DiagnosticsErrorCodes.InvalidKeyFrameInterval:
      case DiagnosticsErrorCodes.HighFpsRate:
        return AlertSeverity.info;

      case DiagnosticsErrorCodes.EntryRestarted:
        return AlertSeverity.warning;

      case DiagnosticsErrorCodes.NoAudioSignal:
      case DiagnosticsErrorCodes.NoVideoSignal:
      case DiagnosticsErrorCodes.PtsDrift:
        return AlertSeverity.error;

      case DiagnosticsErrorCodes.BackupOnlyStream:
        return recordingEnabled ? AlertSeverity.warning : AlertSeverity.info;

      default:
        return AlertSeverity.info;
    }
  }
}
