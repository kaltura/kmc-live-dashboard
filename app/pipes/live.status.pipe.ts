import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'liveStatus'})
export class LiveStatusPipe implements PipeTransform {
  transform(value = 0): string {
    let liveStatusHtml = '';
    switch (value) {
      case 0:
        liveStatusHtml = '<span class="ldb-entry-status ldb-entry-status-offline">OFFLINE</span>';
        break;
      case 1:
        liveStatusHtml = '<span class="ldb-entry-status ldb-entry-status-live">LIVE</span>';
        break;
      case 2:
      case 3:
        liveStatusHtml = '<span class="ldb-entry-status ldb-entry-status-pending">PENDING</span>';
        break;
      default:
        liveStatusHtml = '<span class="ldb-entry-status ldb-entry-status-offline">ERROR</span>';
        break;
    }
    return liveStatusHtml;
  }
}
