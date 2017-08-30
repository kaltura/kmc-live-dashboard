import { Pipe, PipeTransform } from '@angular/core';
import {DiagnosticsErrorCodes, AlertSeverity} from "../app/live-entry.service";


@Pipe({
  name: 'codeToSeverity'
})
export class CodeToSeverityPipe implements PipeTransform {

  transform(code : number): number {

    switch (code) {
      case DiagnosticsErrorCodes.MissingTrackAlert:
      case DiagnosticsErrorCodes.InvalidKeyFramesAlert:
      case DiagnosticsErrorCodes.BitrateUnmatched:
      case DiagnosticsErrorCodes.EntryStopped:
      case DiagnosticsErrorCodes.EntryStarted:
        return AlertSeverity.info;

      case DiagnosticsErrorCodes.EntryRestartedAlert:
        return AlertSeverity.warning;

      case DiagnosticsErrorCodes.NoAudioSignal:
      case DiagnosticsErrorCodes.NoVideoSignal:
      case DiagnosticsErrorCodes.PtsDrift:
        return AlertSeverity.error;

      default:
        return AlertSeverity.warning;
    }
  }
}
