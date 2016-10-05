import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'liveStatus'})
export class LiveStatusPipe implements PipeTransform {
  transform(value = '0'): string {
    let liveStatus = '';
    switch (value.toString()) {
      case '0':
        liveStatus = 'not_live_red.png';
        break;
      case '1':
        liveStatus = 'live_green.png';
        break;
      default:
        liveStatus = 'unknown_grey.png';
        break;
    }
    return 'app/assets/content/liveStatus/' + liveStatus;
  }
}
